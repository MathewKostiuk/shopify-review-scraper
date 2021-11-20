const express = require('express');
const Reviews = require('../db/models/reviews')
const Channels = require('../db/models/channels');
const Themes = require('../db/models/themes');
const Slack = require('../services/slack');
const router = express.Router();

router.get('/channels', async (req, res) => {
  const channels = await Channels.getChannels();
  res.json({ channels });
});

router.get('/channels/brand/:brand_id', async (req, res) => {
  try {
    const channel = await Channels.getChannelsByBrandId(req.params.brand_id);
    res.json({ channel });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post('/channels', async (req, res) => {
  try {
    await Channels.createChannel(req.body);
    res.status(201).json({});
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete('/channels/:channel_id', async (req, res) => {
  const { channel_id: id } = req.params;
  try {
    const channel = await Channels.getChannelById(id);
    await Channels.deleteChannel(channel[0].id);
    res.status(204).json({})

  } catch (error) {
    res.status(404);
    res.statusMessage = "Not found";
  }
});

module.exports = router;
