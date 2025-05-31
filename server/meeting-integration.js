const { GoogleMeet } = require('google-meet-api');

module.exports = {
  scheduleMeeting: async (clientId) => {
    const meet = new GoogleMeet({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
    });
    return await meet.create({
      title: `Security Review - ${clientId}`,
      durationMinutes: 60,
      attendees: [process.env.CLIENT_EMAIL]
    });
  }
};