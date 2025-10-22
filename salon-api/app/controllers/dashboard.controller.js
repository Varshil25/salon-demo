const db = require("../models");
const Salon = db.Salon;
const Barber = db.Barber;
const Appointment = db.Appointment;
const AppointmentService = db.AppointmentService;
const Service =db.Service;
const User = db.USER;
const { role } = require('../config/roles.config');
const jwt = require('jsonwebtoken');
const roles = db.roles;
const { Op } = require('sequelize'); // Make sure you import Op from Sequelize for date comparisons
const moment = require('moment'); // You can use the moment library to easily work with dates
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const sendResponse = require('../helpers/responseHelper');  // Import the helper
const { put } = require('@vercel/blob'); // Import 'put' directly if using Vercel's blob SDK upload method
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('https://tor1.digitaloceanspaces.com'), // Replace with your DigitalOcean Spaces endpoint
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
});

//common Dashboard 
exports.getDashboardData = async (req, res) => {
    try {
        // Step 1: Extract the userId from the JWT token (req.user should already have the decoded token)
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found', code: 401 });
        }

        // Step 2: Fetch the user and their role (ensure the role is included in the query)
        const user = await User.findByPk(userId, { include: {
            model: roles,  // Include the associated Role model
            as: 'role',    // Alias for the Role model (adjust based on your model's actual alias)
        } });

        if (!user || !user.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized User' });
        }

        const userRole = user.role.role_name;

        // Step 3: Collect data based on role
        let data = {};

        if (userRole === role.ADMIN) {
            // Admin specific data
            const customerRole = await db.roles.findOne({ where: { role_name: role.CUSTOMER } });
            const barberRole = await db.roles.findOne({ where: { role_name: role.BARBER } });
            const salonOwnerRole = await db.roles.findOne({ where: { role_name: role.SALON_OWNER } });
            const adminRole = await db.roles.findOne({ where: { role_name: role.ADMIN } });
            
            if (!customerRole || !barberRole || !salonOwnerRole || !adminRole) {
                return res.status(400).json({ success: false, message: 'One or more roles not found' });
            }

            // Most Famous Salons (Top 3 salons with the highest number of appointments)
            const topSalons = await Appointment.findAll({
                attributes: ['SalonId', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'appointmentsCount']],
                group: ['SalonId'],
                order: [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'DESC']],
                limit: 3
            });

            // Fetch salon details for the top 3 salons
            const salonIds = topSalons.map(salon => salon.SalonId);
            const salonData = await Salon.findAll({
                where: {
                    id: salonIds
                },
                attributes: ['id', 'name']  // Fetch salon details like id and name
            });

            // Combine salon data with appointment counts
            const topSalonsWithDetails = topSalons.map(salon => {
                const salonDetails = salonData.find(s => s.id === salon.SalonId);
                return {
                    salonId: salon.SalonId,
                    appointmentsCount: salon.dataValues.appointmentsCount,
                    salonName: salonDetails ? salonDetails.name : 'Unknown'
                };
            });

            // Most Famous Barbers (Top 3 barbers with the highest number of appointments)
            const topBarbers = await Appointment.findAll({
                attributes: ['BarberId', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'appointmentsCount']],
                group: ['BarberId'],
                order: [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'DESC']],
                limit: 3
            });

            // Fetch barber details for the top 3 barbers
            const barberIds = topBarbers.map(barber => barber.BarberId);
            const barberData = await Barber.findAll({
                where: {
                    id: barberIds
                },
                attributes: ['id', 'name']  // Fetch barber details like id and name
            });

            // Combine barber data with appointment counts
            const topBarbersWithDetails = topBarbers.map(barber => {
                const barberDetails = barberData.find(b => b.id === barber.BarberId);
                return {
                    barberId: barber.BarberId,
                    appointmentsCount: barber.dataValues.appointmentsCount,
                    barberName: barberDetails ? barberDetails.name : 'Unknown'
                };
            });

             // Fetch top 3 services by number of appointments
             const topServices = await AppointmentService.findAll({
                attributes: [
                    'ServiceId',
                    [db.sequelize.fn('COUNT', db.sequelize.col('AppointmentId')), 'usageCount']
                ],
                group: ['ServiceId'],
                order: [[db.sequelize.fn('COUNT', db.sequelize.col('AppointmentId')), 'DESC']],
                limit: 3,
            });

            // Fetch service details
            const serviceIds = topServices.map(service => service.ServiceId);
            const serviceDetails = await Service.findAll({
                where: { id: serviceIds },
                attributes: ['id', 'name', 'description','isActive'], // Add relevant fields
            });

            const topServicesWithDetails = topServices.map(service => {
                const serviceInfo = serviceDetails.find(s => s.id === service.ServiceId);
                return {
                    serviceId: service.ServiceId,
                    usageCount: service.dataValues.usageCount,
                    serviceName: serviceInfo ? serviceInfo.name : 'Unknown',
                    serviceDescription: serviceInfo ? serviceInfo.description : 'No description',
                    servicePrice: serviceInfo ? serviceInfo.price : null,
                    serviceisActive: serviceInfo ? serviceInfo.isActive : 'Not found',
                };
            });

            data = {
               
                // totalAdmins: await User.count({ where: { RoleId: adminRole.id } }),
                totalBarbers: await Barber.count(),
                // totalSalonOwners: await User.count({ where: { RoleId: salonOwnerRole.id}}),
                totalCustomers: await User.count({ where: { RoleId: customerRole.id } }), // Use customerRole.id
                totalSalons: await Salon.count(),
                totalAppointments: await Appointment.count(),
                activeAppointmentsCount: await Appointment.count({ where: { status: 'in_salon' } }), // Active appointments only with 'in_salon' status
                pendingAppointmentsCount: await Appointment.count({ where: { status: 'checked_in' } }), // Pending appointments
                completedAppointmentsCount: await Appointment.count({ where: { status: 'completed' } }),
                canceledAppointmentsCount: await Appointment.count({ where: { status: 'canceled' } }),
                totalService : await Service.count(),
                topSalonsWithDetails,
                topBarbersWithDetails,
                topServicesWithDetails
           
            };


        } else if (userRole === role.SALON_OWNER) {
            // Salon Owner specific data
            const salonOwnerSalons = await Salon.findAll({ where: { UserId: userId } });

            if (salonOwnerSalons.length === 0) {
                return res.status(404).json({ success: false, message: 'No salons found for this owner' });
            }

            // Collecting the number of salons owned
            const totalSalons = salonOwnerSalons.length;

            // Collecting active appointments for the owned salons (only 'in_salon' status)
            const activeAppointmentsCount = await Appointment.count({
                where: {
                    SalonId: salonOwnerSalons.map(salon => salon.id),
                    status: 'in_salon'  // Only active appointments with 'in_salon' status
                }
            });

            const pendingAppointmentsCount = await Appointment.count({
                where: {
                    SalonId: salonOwnerSalons.map(salon => salon.id),
                    status: 'checked_in'  // Pending appointments (checked_in)
                }
            });

            const completedAppointmentsCount = await Appointment.count({
                where: {
                    SalonId: salonOwnerSalons.map(salon => salon.id),
                    status: 'completed'
                }
            });
            const canceledAppointmentsCount = await Appointment.count({
                where: {
                    SalonId: salonOwnerSalons.map(salon => salon.id),
                    status: 'canceled'
                }
            });
            const totalCustomers = await Appointment.count({
                distinct: true,
                col: 'UserId',  // Count distinct users (customers)
                where: {
                    SalonId: salonOwnerSalons.map(salon => salon.id),
                    status: { [Op.in]: ['checked_in', 'in_salon', 'completed', 'canceled'] }  // Including all statuses
                }
            });

            const totalBarbers = await Barber.count({
                where: {
                    SalonId: salonOwnerSalons.map(salon => salon.id)
                }
            });

            const totalAppointments = await Appointment.count({
                where: {
                    SalonId: salonOwnerSalons.map(salon => salon.id)
                }
            });

            data = {
                totalBarbers,
                totalCustomers,
                totalAppointments,
                activeAppointmentsCount,
                pendingAppointmentsCount,
                completedAppointmentsCount,
                canceledAppointmentsCount
            };

        } else if (userRole === role.BARBER) {
            // Barber specific data
            const barber = await db.Barber.findOne({ where: { UserId: userId } });

            if (!barber) {
                return res.status(404).json({ success: false, message: 'Barber not found' });
            }

            // Fetch active appointments for the barber (only 'in_salon' status)
            const activeAppointmentsCount = await Appointment.count({
                where: { BarberId: barber.id, status: 'in_salon' } // Active appointments only with 'in_salon' status
            });

            const pendingAppointmentsCount = await Appointment.count({
                where: { BarberId: barber.id, status: 'checked_in' } // Pending appointments for barber
            });
            const completedAppointmentsCount = await Appointment.count({
                where: { BarberId: barber.id, status: 'completed' }
            });
            const canceledAppointmentsCount = await Appointment.count({
                where: { BarberId: barber.id, status: 'canceled' }
            });

            data = {
                totalAppointments: await Appointment.count(),
                activeAppointmentsCount,
                pendingAppointmentsCount,
                completedAppointmentsCount,
                canceledAppointmentsCount
            };

        } else {
            return res.status(403).json({ success: false, message: 'Role not authorized' });
        }

        // Step 4: Send response with the collected data
        res.json({
            success: true,
            message: `${userRole} Dashboard Data`,
            data,
            code: 200
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ success: false, message: 'Server Error', code: 500 });
    }
};

//Dashboard for Appointment
exports.getAppointmentDashboardData = async (req, res) => {
    try {
        // Step 1: Extract the userId from the JWT token (req.user should already have the decoded token)
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found', code: 401 });
        }

        // Step 2: Fetch the user and their role (ensure the role is included in the query)
        const user = await User.findByPk(userId, { include: {
            model: roles,  // Include the associated Role model
            as: 'role',    // Alias for the Role model (adjust based on your model's actual alias)
        } });

        if (!user || !user.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized User' });
        }

        const userRole = user.role.role_name;

        // Step 3: Get today's date range (start of the day to end of the day)
        const startOfDay = moment().startOf('day').toDate(); // Beginning of today
        const endOfDay = moment().endOf('day').toDate(); // End of today

        // Step 4: Collect data based on role
        let data = {};

        if (userRole === role.ADMIN) {
            // Admin specific data for today
            data = {
                totalAppointments: await Appointment.count({
                    where: {
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                pendingAppointmentsCount: await Appointment.count({
                    where: {
                        status: 'checked_in',
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                completedAppointmentsCount: await Appointment.count({
                    where: {
                        status: 'completed',
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                canceledAppointmentsCount: await Appointment.count({
                    where: {
                        status: 'canceled',
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                activeAppointmentsCount: await Appointment.count({
                    where: {
                        status: 'in_salon',  // Count appointments with status 'in_salon'
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                })
            };

        } else if (userRole === role.SALON_OWNER) {
            // Salon Owner specific data for today
            const salonOwnerSalons = await Salon.findAll({ where: { UserId: userId } });

            if (salonOwnerSalons.length === 0) {
                return res.status(404).json({ success: false, message: 'No salons found for this owner' });
            }

            // Collecting the number of appointments for today for owned salons
            data = {
                totalAppointments: await Appointment.count({
                    where: {
                        SalonId: salonOwnerSalons.map(salon => salon.id),
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                pendingAppointmentsCount: await Appointment.count({
                    where: {
                        SalonId: salonOwnerSalons.map(salon => salon.id),
                        status: 'checked_in',
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                completedAppointmentsCount: await Appointment.count({
                    where: {
                        SalonId: salonOwnerSalons.map(salon => salon.id),
                        status: 'completed',
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                canceledAppointmentsCount: await Appointment.count({
                    where: {
                        SalonId: salonOwnerSalons.map(salon => salon.id),
                        status: 'canceled',
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                activeAppointmentsCount: await Appointment.count({
                    where: {
                        SalonId: salonOwnerSalons.map(salon => salon.id),
                        status: 'in_salon',  // Count appointments with status 'in_salon'
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                })
            };

        } else if (userRole === role.BARBER) {
            // Barber specific data for today
            const barber = await db.Barber.findOne({ where: { UserId: userId } });

            if (!barber) {
                return res.status(404).json({ success: false, message: 'Barber not found' });
            }

            // Fetching the total number of appointments for today for the barber
            data = {
                totalAppointments: await Appointment.count({
                    where: {
                        BarberId: barber.id,
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                pendingAppointmentsCount: await Appointment.count({
                    where: {
                        BarberId: barber.id,
                        status: 'checked_in',
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                completedAppointmentsCount: await Appointment.count({
                    where: {
                        BarberId: barber.id,
                        status: 'completed',
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                canceledAppointmentsCount: await Appointment.count({
                    where: {
                        BarberId: barber.id,
                        status: 'canceled',
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                }),
                activeAppointmentsCount: await Appointment.count({
                    where: {
                        BarberId: barber.id,
                        status: 'in_salon',  // Count appointments with status 'in_salon'
                        createdAt: { [Op.between]: [startOfDay, endOfDay] }
                    }
                })
            };

        } else {
            return res.status(403).json({ success: false, message: 'Role not authorized' });
        }

        // Step 5: Send response with the collected data
        res.json({
            success: true,
            message: `${userRole} Appointment Dashboard Data for Today`,
            data,
            code: 200
        });

    } catch (error) {
        console.error('Error fetching appointment dashboard data:', error);
        res.status(500).json({ success: false, message: 'Server Error', code: 500 });
    }
};

// Ensure the reports directory exists
const ensureDirectoryExists = (filePath) => {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true }); // Create the directory recursively
    }
};

exports.generateAdminAppointmentReport = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found', code: 401 });
        }

        const user = await User.findByPk(userId, {
            include: {
                model: roles,
                as: 'role',
            }
        });

        if (!user || !user.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized User' });
        }

        const userRole = user.role.role_name;

        // Extract startDate and endDate from request query
        const { startDate, endDate } = req.query;

        // Validate dates
        if (startDate && isNaN(new Date(startDate).getTime())) {
            return res.status(400).json({ success: false, message: "Invalid start date" });
        }
        if (endDate && isNaN(new Date(endDate).getTime())) {
            return res.status(400).json({ success: false, message: "Invalid end date" });
        }

        let data = {};

        if (userRole === role.ADMIN) {
            // Fetch appointment data
            data = {
                totalAppointments: await Appointment.count({
                    where: {
                        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                    }
                }),
                pendingAppointmentsCount: await Appointment.count({
                    where: {
                        status: 'checked_in',
                        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                    }
                }),
                completedAppointmentsCount: await Appointment.count({
                    where: {
                        status: 'completed',
                        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                    }
                }),
                canceledAppointmentsCount: await Appointment.count({
                    where: {
                        status: 'canceled',
                        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                    }
                }),
                activeAppointmentsCount: await Appointment.count({
                    where: {
                        status: 'in_salon',
                        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                    }
                })
            };

            // Fetch total number of salons across all users
            const totalSalons = await Salon.count();
            data.totalSalons = totalSalons;

            // Fetch customer role
            const customerRole = await roles.findOne({ where: { role_name: role.CUSTOMER } });
            if (!customerRole) {
                return sendResponse(res, false, "Customer role not found", null, 404);
            }

            // Fetch the total number of customers (users with the 'customer' role)
            const totalCustomers = await User.count({
                where: {
                    RoleId: customerRole.id // Filter users with the 'customer' role
                }
            });
            data.totalCustomers = totalCustomers;

            // Fetch the total number of barbers working in these salons
            const totalBarbers = await Barber.count();
            data.totalBarbers = totalBarbers;

             // Fetch all barbers and their appointment statistics
             const allBarbers = await Barber.findAll();
             let barbersData = [];
 
             for (const barber of allBarbers) {
                 const activeAppointmentsCount = await Appointment.count({
                     where: { BarberId: barber.id, status: 'in_salon' } // Active appointments only with 'in_salon' status
                 });
 
                 const pendingAppointmentsCount = await Appointment.count({
                     where: { BarberId: barber.id, status: 'checked_in' } // Pending appointments for barber
                 });
 
                 const completedAppointmentsCount = await Appointment.count({
                     where: { BarberId: barber.id, status: 'completed' }
                 });
 
                 const canceledAppointmentsCount = await Appointment.count({
                     where: { BarberId: barber.id, status: 'canceled' }
                 });
 
                 barbersData.push({
                     barberName: barber.name,
                     activeAppointmentsCount,
                     pendingAppointmentsCount,
                     completedAppointmentsCount,
                     canceledAppointmentsCount
                 });
             }

            // Ensure the reports directory exists
            const fileName = `admin_appointment_dashboard_${moment().format('YYYY-MM-DD')}.pdf`;
            const filePath = path.resolve(__dirname, '../public/reports', fileName);
            
            // Ensure the directory exists before writing the file
            ensureDirectoryExists(filePath);

            // Generate PDF
            const doc = new PDFDocument();
            doc.pipe(fs.createWriteStream(filePath));

            doc.fontSize(16).text(`Shear Brilliance Admin Dashboard`, { align: 'center' });
            doc.moveDown(1);
            doc.fontSize(12).text(`Report Date: ${moment().format('YYYY-MM-DD')}`, { align: 'center' });
            doc.text(`Date Range: ${startDate} to ${endDate}`, { align: 'center' });
            doc.moveDown(2);

            // Add Total Salons, Customers, and Barbers Data
            doc.fontSize(12).text(`Total Salons: ${data.totalSalons}`, { align: 'center' });
            doc.fontSize(12).text(`Total Customers: ${data.totalCustomers}`, { align: 'center' });
            doc.fontSize(12).text(`Total Barbers: ${data.totalBarbers}`, { align: 'center' });
            doc.moveDown(2);

            // Draw table headers for appointment counts
            const columnWidth = 180; // Width of each column
            const rowHeight = 20;    // Height of each row
            const tableWidth = 2 * columnWidth; // Total width of the table
            const pageWidth = doc.page.width;   // Get the width of the PDF page
            const marginLeft = (pageWidth - tableWidth) / 2; // Calculate dynamic margin to center the table
            
            const headerY = doc.y; // Store the y-position for the header

            doc.fontSize(12).text('Status', marginLeft, headerY);
            doc.text('Count', marginLeft + columnWidth, headerY);

            doc.moveDown(1);
            doc.lineWidth(1)
                .moveTo(marginLeft, doc.y)
                .lineTo(marginLeft + tableWidth, doc.y)
                .stroke();
            doc.moveDown();

            // Add table data for appointment status counts
            const tableData = [
                ['Total Appointments', data.totalAppointments],
                ['Pending Appointments', data.pendingAppointmentsCount],
                ['Completed Appointments', data.completedAppointmentsCount],
                ['Canceled Appointments', data.canceledAppointmentsCount],
                ['Active Appointments', data.activeAppointmentsCount]
            ];

            // Add table data
            tableData.forEach((row) => {
                const yPosition = doc.y;
                doc.text(row[0], marginLeft, yPosition);
                doc.text(row[1], marginLeft + columnWidth, yPosition);

                doc.moveTo(marginLeft, yPosition + rowHeight)
                    .lineTo(marginLeft + tableWidth, yPosition + rowHeight)
                    .stroke();

                doc.moveDown(1);
            });

            doc.addPage();

             doc.fontSize(14).text('Barber Details', { align: 'center' });
             doc.moveDown(1);
 
             barbersData.forEach(barber => {
                 doc.fontSize(12).text(`Barber: ${barber.barberName}`, { align: 'left' });
                 doc.text(`Active Appointments: ${barber.activeAppointmentsCount}`, { align: 'left' });
                 doc.text(`Pending Appointments: ${barber.pendingAppointmentsCount}`, { align: 'left' });
                 doc.text(`Completed Appointments: ${barber.completedAppointmentsCount}`, { align: 'left' });
                 doc.text(`Canceled Appointments: ${barber.canceledAppointmentsCount}`, { align: 'left' });
                 doc.moveDown(1); // Space between different barbers
             });
            
            doc.end();

             // Upload to DigitalOcean Spaces
            const fileBuffer = fs.readFileSync(filePath);
            const uploadParams  = {
                Bucket: "shearbrilliance", // Replace this for testing
                Key: `reports/${fileName}`,
                Body: fileBuffer,
                ACL: 'public-read',
                ContentType: 'application/pdf',
            };
            
            console.log({
                Bucket: process.env.DO_SPACES_BUCKET,
                Key: `reports/${fileName}`,
                ContentType: 'application/pdf',
            });
            

            try {
                const uploadResult = await s3.upload(uploadParams).promise();
                console.log('Upload Result:', uploadResult);
                res.status(200).json({
                    success: true,
                    message: 'PDF report generated successfully',
                    downloadLink: uploadResult.Location,
                });
            } catch (err) {
                console.error('Error uploading file:', err);
                res.status(500).json({ success: false, message: 'File upload failed' });
            }

        } else {
            return res.status(403).json({ success: false, message: 'Role not authorized' });
        }

    } catch (error) {
        console.error('Error generating admin appointment report:', error);
        res.status(500).json({ success: false, message: 'Server Error', code: 500 });
    }
};


