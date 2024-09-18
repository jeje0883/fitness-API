const Workout = require('../models/Workout');
const auth = require("../auth");
const { errorHandler } = auth;


module.exports.createWorkout = async (req, res) => {
    const { name, duration, status, dateAdded } = req.body;
    const userId = req.userId;

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
        

        return res.status(201).send(
            savedWorkout
        // {    success: true,
        // {
        //     message: 'Workout created successfully',
        //     savedWorkout
        //  }
        );

    } catch (err) {
        // Handle validation errors and other issues
        return errorHandler(err, req, res);
    }
};

module.exports.getAllWorkouts =  async (req, res) => {
    const userId = req.userId;
    try {
        const workouts = await Workout.find({userId: userId});
        return res.status(200).send(workouts);
    } catch (err) {
        errorHandler(err, req, res);
    }
}


module.exports.getActiveWorkouts =  async (req, res) => {
    try {
        const workout = await Workout.find({ isActive: true });
        return res.status(200).send(workout);
    } catch (err) {
        errorHandler(err, req, res);
    }
}


module.exports.getWorkoutById =  async (req, res) => {
    try {
        id = req.params.id;
        const workout = await Workout.findById(id);

        if (!workout) {
            return res.status(404).send({error: 'Workout not found'});
        }

        return res.status(200).send(workout);

    } catch (err) {
        errorHandler(err, req, res);
    }
}



module.exports.searchByName =  async (req, res) => {
    try {
        const workout = await Workout.find({
            name: { $regex: req.body.name, $options: 'i' }, //use this for wildcard search
            // name: req.body.name
        })
        return res.status(200).send(workout);
    } catch (err) {
        errorHandler(err, req, res);
    }
}



module.exports.updateWorkout =  async (req, res) => {
    try {

        const { name, duration, status } = req.body

        const updatedWorkout = await Workout.findByIdAndUpdate(req.params.id, {
        name : name,
        duration : duration,
        status : status
        },
        { new: true }
        );

        if (!updatedWorkout) {
            return res.status(404).send({
                //success: false,
                error: 'Workout not found'
            });
        }


        return res.status(200).send({
            success: true,
            message: 'Workout updated successfully',
            workouts: updatedWorkout
        });

    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports.activateWorkout =  async (req, res) => {
    try {

        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).send({
                //success: false,
                error: 'Workout not found'
            });
        }

        if (workout.isActive) {
            return res.status(200).send({
                //success: false,
                message: 'Workout already active',
                workout: workout
            });
        }


        const updatedWorkout = await Workout.findByIdAndUpdate(req.params.id, {
        isActive : true
        },
        { new: true }
        );

        

        return res.status(200).send({
            success: true,
            message: 'Workout activated successfully',
            activateWorkout: updatedWorkout
        });

    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports.archiveWorkout =  async (req, res) => {
    try {

        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).send({
                //success: false,
                error: 'Workout not found'
            });
        }

        if (!workout.isActive) {
            return res.status(200).send({
                //success: false,
                message: 'Workout already archived',
                archivedWorkout: workout
            });
        }


        const updatedWorkout = await Workout.findByIdAndUpdate(req.params.id, {
            isActive : false
            },
            { new: true }
            );
    
    
            return res.status(200).send({
                success: true,
                message: 'Workout archived successfully',
                //data: updatedWorkout
            });

    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports.deleteWorkout =  async (req, res) => {
    try {
        const id = req.params.id;

        const deletedWorkout = await Workout.findByIdAndDelete(id);

        if (!deletedWorkout) {
            return res.status(404).send({
                //success: false,
                error: 'Workout not found'
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Workout deleted successfully',
            deletedWorkout
        });

    }
    catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports.completeWorkoutStatus =  async (req, res) => {
    try {
        const workoutId = req.params.id;
        const userId = req.userId;

        const completedWorkout = await Workout.findByIdAndUpdate(
            { _id: workoutId, userId: userId },
            { status: 'completed' },
            { new: true }
        );

        if (!completeddWorkout) {
            return res.status(404).send({
                //success: false,
                error: 'Workout not found'
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Workout deleted successfully',
            updatedWorkout: completedWorkout
        });

    }
    catch (err) {
        errorHandler(err, req, res);
    }
}