const express = require('express');
const Channels = require('../db/models/channels');
const Themes = require('../db/models/themes');
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

router.get('/themes', async (req, res) => {
  const themes = await Themes.getAllThemes();
  res.json({ themes });
});

router.get('/themes/:theme', async (req, res) => {
  const theme = await Themes.getThemeByHandle(req.params.theme);
  const themeReviews = await Reviews.getAllByThemeId(theme[0].theme_id);
  res.json({ themeReviews });
});


module.exports = router;
