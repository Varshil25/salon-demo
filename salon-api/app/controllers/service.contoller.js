
// controllers/serviceController.js
const db = require("../models");
const Service = db.Service;
const sendResponse = require('../helpers/responseHelper'); // Make sure this path is correct
const { Op } = require('sequelize'); // Import Op for Sequelize operations

// Create a new service
exports.create = async (req, res) => {
    try {
        const { name, description,default_service_time, price, isActive } = req.body;


        // Check if a service with the same name already exists
        const existingService = await Service.findOne({ where: { name } });
        if (existingService) {
            return sendResponse(res, false, 'Service name is already taken', null, 400);
        }

        const service = await Service.create({
            name,
            description,
            default_service_time,
            price,
            isActive,
        });

        sendResponse(res, true, 'Service created successfully', service, 201);
    } catch (error) {
        sendResponse(res, false, error.message, null, 500);
    }
};

// Get all services
exports.findAll = async (req, res) => {
    try {
        const services = await Service.findAll({  order: [['createdAt', 'ASC']], });
        sendResponse(res, true, 'Services retrieved successfully', services, 200);
    } catch (error) {
        sendResponse(res, false, error.message, null, 500);
    }
};

// Get a service by ID
exports.findOne = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);

        if (!service) {
            return sendResponse(res, false, 'Service not found', null, 404);
        }

        sendResponse(res, true, 'Service retrieved successfully', service, 200);
    } catch (error) {
        sendResponse(res, false, error.message, null, 500);
    }
};

// Update a service by ID
exports.update = async (req, res) => {
    try {
        const { name, description,default_service_time, price, isActive } = req.body;
        const service = await Service.findByPk(req.params.id);

        if (!service) {
            return sendResponse(res, false, 'Service not found', null, 404);
        }

        service.name = name || service.name;
        service.description=description || service.description;
        service.default_service_time = default_service_time || service.default_service_time;
        service.price = price || service.price;
        service.isActive = isActive !== undefined ? isActive : service.isActive;

        await service.save();

        sendResponse(res, true, 'Service updated successfully', service, 200);
    } catch (error) {
        sendResponse(res, false, error.message, null, 500);
    }
};

exports.updateIsActive = async (req, res) => {
    try {
      const { id } = req.params; // Extract service ID from URL parameters
      const { isActive } = req.body; // Extract isActive from request body
  
      // Validate if isActive is provided and is a valid boolean value
      if (typeof isActive !== 'boolean') {
        return sendResponse(res, false, 'isActive status must be a boolean', null, 400);
      }
  
      // Find the service by ID
      const service = await Service.findByPk(id);
      
      if (!service) {
        return sendResponse(res, false, 'Service not found', null, 404);
      }
  
      // Update the isActive field
      service.isActive = isActive;
  
      // Save the updated service
      await service.save();
  
      // Send a response with the updated service
      return sendResponse(res, true, 'Service updated successfully', service, 200);
    } catch (error) {
      console.error('Error updating service:', error);
      return sendResponse(res, false, 'An error occurred while updating the service.', null, 500);
    }
  };
  


