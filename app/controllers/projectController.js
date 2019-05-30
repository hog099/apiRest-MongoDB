const express = require('express')
const authMiddleware = require('../middlewares/auth')
const Project = require('../models/project/Project')
const Task = require('../models/task/Task')

const router = express.Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks'])

        res.send({ projects })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Falha ao listar os projetos.' })
    }
});

router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks'])

        if (!project) {
            return res.status(400).send({ error: 'Projeto não encontrado, tente novamente.' })
        }
        res.send({ project })
    } catch (err) {
        return res.status(400).send({ error: 'Falha ao listar o projeto selecionado.' })
    }
})

router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body
        const project = await Project.create({ title, description, user: req.userId })

        await Promise.all(tasks.map(async task => {
            // const projectTask = Task.create({...task, project: project._id})
            const projectTask = new Task({ ...task, project: project._id })

            await projectTask.save()
            project.tasks.push(projectTask)
        })
        )

        await project.save()

        return res.send({ project })
    } catch (err) {
        return res.status(400).send({ error: 'Falha ao criar um novo projeto.' })
    }

})

router.put('/:projectId', async (req, res) => {

    try {
        const { title, description, tasks } = req.body
        const project = await Project.findByIdAndUpdate(req.params.projectId,
            { title, description }, { new: true })

        // console.log(project.tasks)
        project.tasks = []
        await Task.deleteOne({ project: project._id })

        await Promise.all(tasks.map(async task => {
            // const projectTask = Task.create({...task, project: project._id})
            const projectTask = new Task({ ...task, project: project._id })

            await projectTask.save()
            project.tasks.push(projectTask)
        })
        )

        await project.save()

        return res.send({ project })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Falha ao atualizar o projeto selecionado.' })
    }

})

router.delete('/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.projectId)

        res.send()
    } catch (err) {
        return res.status(400).send({ error: 'Falha ao remover o projeto selecionado.' })
    }
})

module.exports = app => app.use('/projects', router)