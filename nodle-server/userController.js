const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const admin = require('firebase-admin');
const serviceAccount = require('./service-firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  
const projectId = process.env.PROJECT_ID;

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15);
}

async function createAndStoreSecret(projectId, userId, secretValue) {
    const client = new SecretManagerServiceClient();
    const [secret] = await client.createSecret({
      parent: `projects/${projectId}`,
      secretId: userId, 
      secret: {
        replication: {
          automatic: {},
        },
      },
    });
  
    await client.addSecretVersion({
      parent: secret.name,
      payload: {
        data: Buffer.from(secretValue, 'utf8'),
      },
    });
}
  
  async function accessSecret(projectId, userId) {
      const client = new SecretManagerServiceClient();
      const secretPath = `projects/${projectId}/secrets/${userId}/versions/1`;
    
      console.log('Attempting to access secret at path:', secretPath);
    
      const [version] = await client.accessSecretVersion({
        name: secretPath,
      });
    
      return version.payload.data.toString('utf8');
}

exports.register = async(req, res) => {
    try {
        const userId = generateUniqueId();
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
        const userRecord = await admin.auth().createUser({
          uid: userId,
          email: req.body.email,
        });
    
        await admin.auth().setCustomUserClaims(userId, { passwordHash: hashedPassword });

        const token = jwt.sign({userId: userRecord.uuid}, process.env.JWT_SECRET, { expiresIn: '9h' });
    
        res.json({ token, userId, message: 'Registration successful' });
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
}

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const userRecord = await admin.auth().getUserByEmail(email);
    
        const { passwordHash } = userRecord.customClaims;
    
        if (!passwordHash) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        const passwordMatch = await bcrypt.compare(password, passwordHash);
        
        if (passwordMatch) {
          const token = jwt.sign({userId: userRecord.uuid}, process.env.JWT_SECRET, { expiresIn: '9h' });
          res.json({ message: 'Login successful', token });

        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } catch (error) {
        console.error('Error during login:', error);
        res.status(401).json({ error: 'Invalid credentials' });
      }
}

exports.storeSecret = async(req, res) => {
    try {
        const userId = req.params.userId;
        const secretValue = req.body.secret;
        try {
            await admin.auth().getUser(userId);
          } catch (firebaseError) {
            if (firebaseError.code === 'auth/user-not-found') {
              return res.status(404).json({ error: 'User not found' });
            } else {
              throw firebaseError;
            }
          }
    
        await createAndStoreSecret(projectId, userId, secretValue);
    
        res.json({ message: 'Secret stored successfully' });
      } catch (error) {
        console.error('Error storing secret:', error);
        res.status(500).json({ error: 'Failed to store secret' });
      }
}

exports.getSecret = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const userRecord = await admin.auth().getUser(userId);
  
      if (!userRecord) {
        return res.status(404).json({ error: 'User not found' });
      }
      console.log("userid", userId);
      const secretValue = await accessSecret(projectId, userId);
    
      res.json({ secret: secretValue });
    } catch (error) {
      console.error('Error fetching secret:', error);
      res.status(500).json({ error: 'Failed to fetch secret' });
    }
  };