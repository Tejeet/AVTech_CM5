const fastify = require('fastify')();
const redis = require('redis');
const db = require('./db'); // Import the DB module

// Redis setup
const client = redis.createClient({
  url: 'redis://localhost:6380'
});

client.connect()
  .then(() => console.log('✅ Connected to Redis'))
  .catch(err => {
    console.error('❌ Redis connection error:', err);
    process.exit(1);
  });

// Homepage with Redis visit count
fastify.get('/', async (request, reply) => {
  try {
    const count = await client.incr('visit_count');
    return { message: 'Hello from Node.js', visits: count };
  } catch (err) {
    console.error('Redis error:', err);
    reply.code(500).send({ error: 'Redis failure' });
  }
});

// Simulated API function
async function testApi(imageData) {
  console.log('📡 Simulating API call...');
  return { status: 'success', message: 'API call simulated' };
}

// POST /upload/record route
fastify.post('/upload/record', async (req, reply) => {
  const body = req.body;

  if (body.cmd && body.cmd === 'face') {
    const result = {
      reply: "ACK",
      cmd: "face",
      code: 0,
      cap_time: body.cap_time,
      sequence_no: body.sequence_no,
      data: {
        match_success: true,
        personName: "some one",
        personId: 123,
        profileImage: "base64"
      }
    };

    const jsonString = JSON.stringify(result);

    db.run(`INSERT INTO logs (data) VALUES (?)`, [jsonString], function (err) {
      if (err) {
        console.error('❌ DB Insert Error:', err);
      } else {
        console.log(`✅ Logged result with ID ${this.lastID}`);
      }
    });

    reply.send(result);

    if (body.closeup_pic && body.closeup_pic.data) {
      const apiResult = await testApi(body.closeup_pic.data);
      console.log("✅ API Result:", apiResult);
    }
  } else {
    reply.code(400).send({ error: 'Invalid command or missing data' });
  }
});

// Start the server
fastify.listen({ port: 4010, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Fastify running at ${address}`);
});
