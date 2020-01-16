const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
  async index(req, res) {
    const devs = await Dev.find()

    return res.json(devs)
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body

    let dev = await Dev.findOne({ github_username })

    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      )

      const { name = login, avatar_url, bio, email } = apiResponse.data

      const techsArray = parseStringAsArray(techs)

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      })
    }

    return res.json(dev)
  },

  async update(req, res) {
    const { name, avatar_url, bio, techs, latitude, longitude } = req.body
    const UserId = req.params.id

    let dev = await Dev.findById(UserId)

    if (!dev) {
      return res.status(404).json({ error: 'Dev não existe' })
    }

    dev = await Dev.findByIdAndUpdate(
      UserId,
      {
        $set: {
          name,
          avatar_url,
          bio,
          techs,
          latitude,
          longitude
        }
      },
      { new: true, omitUndefined: true }
    )

    return res.status(200).json(dev)
  },

  async destroy(req, res) {
    try {
      UserId = req.params.id
      const response = await Dev.findByIdAndDelete(UserId)

      return res.json(response)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }
}
