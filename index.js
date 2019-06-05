
const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());

server.get('/api/cohorts', async (req, res) => {
    try {
        const cohort = await db('cohorts');
        res.status(200).json(cohort);
    } catch (error) {
        res.status(500).json(error);
    }
});

server.get('/api/cohorts/:id', async (req, res) => {
    try {
        const cohort = await db('cohorts')
            .where({ id: req.params.id })
            .first();
        res.status(200).json(cohort);
    } catch (error) {
        res.status(500).json(error);
    }
});

server.post('/api/cohorts', async (req, res) => {
    try {
        const [id] = await db('cohorts').insert(req.body);
        const cohort = await db('cohorts')
            .where({ id })
            .first();

        res.status(201).json(cohort);
    } catch (error) {
        res.status(500).json({ message, error });
    }
});
server.put('/api/cohorts/:id', async (req, res) => {
    try {
        const count = await db('rocohortses')
            .where({ id: req.params.id })
            .update(req.body);

        if (count > 0) {
            const cohort = await db('cohorts')
                .where({ id: req.params.id })
                .first();

            res.status(200).json(cohort);
        } else {
            res.status(404).json({ message: 'cohort not found' });
        }
    } catch (error) { }
});

server.delete('/api/cohorts/:id', async (req, res) => {
    try {
        const count = await db('cohorts')
            .where({ id: req.params.id })
            .del();

        if (count > 0) {
            res.status(204).json({ message: "cohort has been deleted"}).end();
        } else {
            res.status(404).json({ message: 'cohorts not found' });
        }
    } catch (error) { }
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
    console.log(`\n** API running on http://localhost:${port} **\n`)
);
