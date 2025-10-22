const cron = require('node-cron');
const { Appointment } = require('../models');
const { Op } = require('sequelize');
const db = require('../models');
const Barber = db.Barber;
const { sendMessageToUser } = require('./socket.controller');
const { broadcastBoardUpdates,insalonCustomerUpdates } = require('../controllers/socket.controller');
const { getAppointmentsByRoleExp,getInSalonAppointmentsByRoleExp } = require('./appointments.controller');
const { AppointmentENUM } = require('../config/appointment.config');


exports.cronController = () => {
    cron.schedule('*/1 * * * *', async () => {
        try {
            console.log('Cron job started: Updating wait times and broadcasting updates...');

            // Fetch appointments for today
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            let appointments = await Appointment.findAll({
                where: {
                    status: [AppointmentENUM.In_salon,AppointmentENUM.Checked_in],
                    createdAt: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
                include: [
                    {
                        model: Barber,
                        as: 'Barber',
                    },
                ],
                order: [['queue_position', 'ASC']], // Order by queue position
            });

          
            if (appointments.length === 0) {
                console.log('No active appointments found.');
                return;
            }
            
            // Process `in_salon` users and update estimated wait times for `checked_in` users
            const currentUsers = appointments.filter((app) => app.status === 'in_salon');

            currentUsers.forEach((currentUser) => {
                const barberId = currentUser.BarberId;

                // Get all `checked_in` appointments for the same barber
                const checkInAppointments = appointments.filter(
                    (app) => app.status === 'checked_in' && app.BarberId === barberId
                );

                checkInAppointments.forEach(async (checkInAppointment) => {
                    if (checkInAppointment.estimated_wait_time <= 0) {
                        // Mark appointment as completed if wait time is 0
                        currentUser.status = 'completed';
                        await currentUser.save();

                        console.log(`User ${currentUser.id} completed for Barber ${barberId}`);
                    } else {
                        // Reduce wait time for the `checked_in` user
                        checkInAppointment.estimated_wait_time = Math.max(checkInAppointment.estimated_wait_time - 1, 0);
                        await checkInAppointment.save();

                        // Send updates to individual users
                        sendMessageToUser(
                            checkInAppointment.UserId,
                            'waitTimeUpdate',
                            checkInAppointment
                        );

                        console.log(
                            `Barber ${barberId} | User ${checkInAppointment.id} | New estimated wait time: ${checkInAppointment.estimated_wait_time} minutes.`
                        );
                    }
                });
            });

            const updatedAppointments = await getAppointmentsByRoleExp(false);
            appointments = updatedAppointments;
            broadcastBoardUpdates(appointments);

            // Filter appointments to include only those with status "in_salon"
            const inSalonAppointments = updatedAppointments.filter(
                (appointment) => appointment.status == AppointmentENUM.In_salon
            );
            insalonCustomerUpdates(inSalonAppointments);

            console.log('Cron job completed.');
        } catch (error) {
            console.error('Error in cron job:', error.message);
        }
    });
};


