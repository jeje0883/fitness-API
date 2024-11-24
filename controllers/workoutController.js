const mongoose = require('mongoose');
const Workout = require('../models/Workout');
const auth = require("../auth");
const { errorHandler } = auth;

// Toggle for debugging
const debug = true;

module.exports.createWorkout = async (req, res) => {
    const { name, duration, status, dateAdded } = req.body;
    const userId = req.userId;

    if (debug) console.log('Creating a new workout with data:', { userId, name, duration, status, dateAdded });

    // Create a new workout with the provided data
    const newWorkout = new Workout({
        userId,
        name,
        duration,
        status,
        dateAdded
    });

    try {
        // Save the workout, which will run schema validations
        const savedWorkout = await newWorkout.save();

        if (debug) console.log('Workout created successfully:', savedWorkout);

        return res.status(201).send(savedWorkout);
        // Alternatively, to send a success message, uncomment the following:
        // return res.status(201).send({
        //     success: true,
        //     message: 'Workout created successfully',
        //     savedWorkout
        // });

    } catch (err) {
        if (debug) console.error('Error creating workout:', err);
        // Handle validation errors and other issues
        return errorHandler(err, req, res);
    }
};

module.exports.getAllWorkouts = async (req, res) => {
    const userId = req.userId;

    if (debug) console.log('Fetching all workouts for user:', userId);

    try {
        const workouts = await Workout.find({ userId: userId });

        if (debug) console.log('Fetched workouts:', workouts);

        return res.status(200).send(workouts);
    } catch (err) {
        if (debug) console.error('Error fetching all workouts:', err);
        return errorHandler(err, req, res);
    }
};

module.exports.getActiveWorkouts = async (req, res) => {
    if (debug) console.log('Fetching active workouts');

    try {
        const workouts = await Workout.find({ isActive: true });

        if (debug) console.log('Fetched active workouts:', workouts);

        return res.status(200).send(workouts);
    } catch (err) {
        if (debug) console.error('Error fetching active workouts:', err);
        return errorHandler(err, req, res);
    }
};

module.exports.getWorkoutById = async (req, res) => {
    const id = req.params.id;

    if (debug) console.log('Fetching workout by ID:', id);

    try {
        // Optional: Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (debug) console.warn('Invalid Workout ID format:', id);
            return res.status(400).send({ error: 'Invalid Workout ID' });
        }

        const workout = await Workout.findById(id);

        if (!workout) {
            if (debug) console.warn('Workout not found for ID:', id);
            return res.status(404).send({ error: 'Workout not found' });
        }

        if (debug) console.log('Workout found:', workout);

        return res.status(200).send(workout);
    } catch (err) {
        if (debug) console.error('Error fetching workout by ID:', err);
        return errorHandler(err, req, res);
    }
};

module.exports.searchByName = async (req, res) => {
    const name = req.body.name;

    if (debug) console.log('Searching workouts by name:', name);

    try {
        const workouts = await Workout.find({
            name: { $regex: name, $options: 'i' }, // Use this for wildcard search
            // Alternatively, for exact match, use:
            // name: req.body.name
        });

        if (debug) console.log('Workouts found:', workouts);

        return res.status(200).send(workouts);
    } catch (err) {
        if (debug) console.error('Error searching workouts by name:', err);
        return errorHandler(err, req, res);
    }
};

module.exports.updateWorkout = async (req, res) => {
    const { name, duration, status } = req.body;
    const id = req.params.id;

    if (debug) console.log('Updating workout with ID:', id, 'Data:', { name, duration, status });

    try {
        // Optional: Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (debug) console.warn('Invalid Workout ID format for update:', id);
            return res.status(400).send({ error: 'Invalid Workout ID' });
        }

        const updatedWorkout = await Workout.findByIdAndUpdate(
            id,
            { name, duration, status },
            { new: true }
        );

        if (!updatedWorkout) {
            if (debug) console.warn('Workout not found for update, ID:', id);
            return res.status(404).send({ error: 'Workout not found' });
        }

        if (debug) console.log('Workout updated successfully:', updatedWorkout);

        return res.status(200).send({
            success: true,
            message: 'Workout updated successfully',
            workout: updatedWorkout
        });
    } catch (err) {
        if (debug) console.error('Error updating workout:', err);
        return errorHandler(err, req, res);
    }
};

module.exports.activateWorkout = async (req, res) => {
    const id = req.params.id;

    if (debug) console.log('Activating workout with ID:', id);

    try {
        // Optional: Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (debug) console.warn('Invalid Workout ID format for activation:', id);
            return res.status(400).send({ error: 'Invalid Workout ID' });
        }

        const workout = await Workout.findById(id);

        if (!workout) {
            if (debug) console.warn('Workout not found for activation, ID:', id);
            return res.status(404).send({ error: 'Workout not found' });
        }

        if (workout.isActive) {
            if (debug) console.warn('Workout already active, ID:', id);
            return res.status(200).send({
                message: 'Workout already active',
                workout: workout
            });
        }

        const updatedWorkout = await Workout.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        );

        if (debug) console.log('Workout activated successfully:', updatedWorkout);

        return res.status(200).send({
            success: true,
            message: 'Workout activated successfully',
            activateWorkout: updatedWorkout
        });
    } catch (err) {
        if (debug) console.error('Error activating workout:', err);
        return errorHandler(err, req, res);
    }
};

module.exports.archiveWorkout = async (req, res) => {
    const id = req.params.id;

    if (debug) console.log('Archiving workout with ID:', id);

    try {
        // Optional: Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (debug) console.warn('Invalid Workout ID format for archiving:', id);
            return res.status(400).send({ error: 'Invalid Workout ID' });
        }

        const workout = await Workout.findById(id);

        if (!workout) {
            if (debug) console.warn('Workout not found for archiving, ID:', id);
            return res.status(404).send({ error: 'Workout not found' });
        }

        if (!workout.isActive) {
            if (debug) console.warn('Workout already archived, ID:', id);
            return res.status(200).send({
                message: 'Workout already archived',
                archivedWorkout: workout
            });
        }

        const updatedWorkout = await Workout.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (debug) console.log('Workout archived successfully:', updatedWorkout);

        return res.status(200).send({
            success: true,
            message: 'Workout archived successfully',
            // Optionally include the updated workout:
            // archivedWorkout: updatedWorkout
        });
    } catch (err) {
        if (debug) console.error('Error archiving workout:', err);
        return errorHandler(err, req, res);
    }
};

module.exports.deleteWorkout = async (req, res) => {
    const id = req.params.id;

    if (debug) console.log('Deleting workout with ID:', id);

    try {
        // Optional: Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (debug) console.warn('Invalid Workout ID format for deletion:', id);
            return res.status(400).send({ error: 'Invalid Workout ID' });
        }

        const deletedWorkout = await Workout.findByIdAndDelete(id);

        if (!deletedWorkout) {
            if (debug) console.warn('Workout not found for deletion, ID:', id);
            return res.status(404).send({ error: 'Workout not found' });
        }

        if (debug) console.log('Workout deleted successfully:', deletedWorkout);

        return res.status(200).send({
            success: true,
            message: 'Workout deleted successfully',
            deletedWorkout
        });
    }
    catch (err) {
        if (debug) console.error('Error deleting workout:', err);
        return errorHandler(err, req, res);
    }
};

module.exports.completeWorkoutStatus = async (req, res) => {
    const workoutId = req.params.id;
    const userId = req.userId;

    if (debug) console.log('Completing workout status for ID:', workoutId, 'User ID:', userId);

    try {
        // Optional: Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(workoutId)) {
            if (debug) console.warn('Invalid Workout ID format for completing status:', workoutId);
            return res.status(400).send({ error: 'Invalid Workout ID' });
        }

        const completedWorkout = await Workout.findOneAndUpdate(
            { _id: workoutId, userId: userId },
            { status: 'completed' },
            { new: true }
        );

        if (!completedWorkout) {
            if (debug) console.warn('Workout not found for completing status, ID:', workoutId, 'User ID:', userId);
            return res.status(404).send({ error: 'Workout not found' });
        }

        if (debug) console.log('Workout status completed successfully:', completedWorkout);

        return res.status(200).send({
            success: true,
            message: 'Workout status updated to completed successfully',
            updatedWorkout: completedWorkout
        });
    }
    catch (err) {
        if (debug) console.error('Error completing workout status:', err);
        return errorHandler(err, req, res);
    }
};
