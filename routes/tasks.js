const express = require("express");
const router = express.Router();
const Task = require("../models/task");

//  It should be possible to create a task.
//  It should be possible to read a task.
//  It should be possible to mark a task as completed.
//  It should be possible to update the title of task.
//  It should be possible to delete a task.
//  It should be possible to list all tasks.
//  It should be possible to list all completed tasks.
//  It should be possible to list all pending tasks.



//Test get all
// router.get("/tasks", async (req, res) => {
//   const tasks = await Task.findAll();
//   res.json(tasks);
// });

//Test delete all 
// router.get("/tasks/delete", async (req, res) => {
//   await Task.sync({ force: true });
//   res.json({ message: "Task table reset" });
// });


// Get all tasks --> It should be possible to read a task. Keep return 
//  It should be possible to list all tasks.
//  It should be possible to list all completed tasks.
//  It should be possible to list all pending tasks.

router.get("/tasks/get", async (req, res) => {
  try{
    // For future implementation of pagination get page as well
    // Get the task status [all, pending, completed] 
    const {taskstatus, page} = req.query;
    if (!taskstatus){
      return res.status(400).json({error: "Invalid/empty task status"});
    }
    if (!page){
      return res.status(400).json({error: "Empty page"});
    }

    // If not all then need to filter based on status 
    const filter = taskstatus !== 'all' 
    ? { status: taskstatus }
    : {};

    const tasks = await Task.findAll({
      where: filter,
      // Currently will always be 0 so will return all values but in future can be used for pagination
      offset: 5*(page - 1)
      // limit:15
    });
    res.json(tasks);
  }
  catch(error){
    res.status(500).json({error: "Internal Error"});
  }
});


//  It should be possible to read a task.
router.post("/tasks/read", async (req, res) => {
  try{
    const {taskId} = req.query;
    if (!taskId){
      return res.status(400).json({error: "Task ID is required"});
    }
    const task = await Task.findByPk(taskId);
    //If task doesnt exist
    if (!task) {
      return res.status(404).json({error: "Task not found"});

    }
    res.json(task);
  } catch (error){
    res.status(500).json({error: "Internal Error"});
  }
});


// Create a new task --> It should be possible to create a task. 
router.post("/tasks/create", async (req, res) => {
  try{
    const { taskTitle} = req.query;
    if (!taskTitle){
      return res.status(400).json({error: "Title is required"});
    }
    const task = await Task.create({title: taskTitle, status: "pending" });
    res.json(task);
  }
  catch (error) {
    res.status(500).json({error: "Internal Error"});

  }
});

//  It should be possible to mark a task as completed. 
router.post("/tasks/togglestatus", async (req, res) => {
  try{
    const {taskId} = req.query;
    if (!taskId){
      return res.status(400).json({error: "Task ID is required"});
    }
    const task = await Task.findByPk(taskId);
    if (!task){
      return res.status(400).json({error: "Task not found"});
    }
    // Toggle status of the task based on current status so can change it between both

    task.status = task.status === "completed" ? "pending" : "completed";
    // Save to DB
    await task.save()
    res.json(task);
  }
  catch(error){
    res.status(500).json({error: "Internal Error"});
  }
});



//  It should be possible to update the title of task. 
router.post("/tasks/updatetitle", async (req, res) => {
  try{
    const {taskId, newTitle} = req.query;
    if (!taskId){
      return res.status(400).json({error: "Task ID is required"});
    }
    if (!newTitle){
      return res.status(400).json({error: "Title is required"});
    }
    const task = await Task.findByPk(taskId);
    if (!task){
      return res.status(400).json({error: "Task not found"});
    }
    task.title = newTitle; 
    // Save to db 
    await task.save()
    res.json(task);
  } 
  catch (error) {
    res.status(500).json({error: "Internal Error"});
  }
});

//  It should be possible to delete a task. 
router.post("/tasks/deletetask", async (req, res) => {
  try{
    const {taskId} = req.query;
    if (!taskId){
      return res.status(400).json({error: "Task ID is required"});
    }
    const task = await Task.findByPk(taskId);
    if (!task){
      return res.status(400).json({error: "Task not found"});
    }
    await task.destroy()
    res.json(task);
  }
  catch (error) {
    res.status(500).json({error: "Internal Error"});
  }
});





module.exports = router;
