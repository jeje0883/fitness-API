const express = require('express');
const workoutController = require("../controllers/workoutController");
const { verify, isLoggedIn } = require("../auth");

const router = express.Router();

function logger(req, res, next) {
    console.log('Printing from workoutRouter');
    next();
}

router.post('/', verify, workoutController.createWorkout); //needs verify an

router.get('/all', verify, workoutController.getAllWorkouts); //needs verify an

router.get('/active', workoutController.getActiveWorkouts); //no verfication required

router.get('/:id', workoutController.getWorkoutById); //no verfication required

router.patch('/:id/update', verify, workoutController.updateWorkout); //needs verify an

router.patch('/:id/activate', verify, workoutController.activateWorkout); //needs verify an

router.patch('/:id/archive', verify, workoutController.archiveWorkout); //needs verify an

router.delete('/deleteWorkout/:id', verify, workoutController.deleteWorkout); //needs verify an

router.patch('/completeWorkoutStatus/:id', verify, workoutController.completeWorkoutStatus); //needs

module.exports = router;
