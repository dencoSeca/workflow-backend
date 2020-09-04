const router = require('express').Router({ mergeParams: true })
const Project = require('../models/Project')

// INDEX
router.get('/findall', (req, res) => {
  Project.find({ author: req.body.author }, (err, projects) => {
    if (err) {
      console.log(err)
      err.message = 'Mongoose threw an error while finding all projects'
      res.send(err)
    }
    res.send(projects)
  })
})

// SHOW
router.get('/findsingle', (req, res) => {
  Project.findbyId(req.body.id, (err, project) => {
    if (err) {
      console.log(err)
      err.message = 'Mongoose threw an error while finding a single project'
      res.send(err)
    }
    if (project == null) {
      const newErr = new Error()
      newErr.message = 'Cannot find project with that name'
      res.send(newErr)
    }
    res.send(project)
  })
})

// CREATE
router.post('/create', async (req, res) => {
  // Check that the project name is unique
  const projectExists = await Project.find({ author: req.body.author, name: req.body.name })
  if (projectExists.length > 0) {
    const newErr = new Error()
    newErr.message = 'Project with that name already exists'
    res.send(newErr)
  } else {
    // Creat a new project and send it's data back
    Project.create(req.body, (err, project) => {
      if (err) {
        console.log(err)
        res.send(err)
      }
      res.send(project)
    })
  }
})

// UPDATE
router.post('/update', (req, res) => {
  // Find and update the project
  Project.findByIdAndUpdate(req.body.id, req.body.project, (err, project) => {
    if (err) {
      console.log(err)
      err.message = 'Failed to update project'
      res.send(err)
    }
    // Return the updated project
    Project.findOne(project._id, (err, updatedProject) => {
      if (err) {
        console.log(err)
        err.message = 'Failed to find updated project'
        res.send(err)
      }
      res.send(updatedProject)
    })
  })
})

// DELETE
router.delete('/delete', (req, res) => {
  Project.findByIdAndDelete(req.body.id, err => {
    if (err) {
      console.log(err)
      err.message = 'Failed to delete project'
      res.send(err)
    }
    res.send({ message: 'Project deleted successfully' })
  })
})

module.exports = router
