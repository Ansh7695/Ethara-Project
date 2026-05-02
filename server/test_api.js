const axios = require('axios');

async function run(){
  try{
    console.log('Health ->', (await axios.get('http://localhost:5000/api/health')).data);
    console.log('Seeding...');
    console.log((await axios.post('http://localhost:5000/api/seed')).data);
    console.log('Demo login ->');
    const demo = await axios.get('http://localhost:5000/api/auth/demo');
    console.log(demo.data);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + demo.data.token;
    console.log('Projects ->', (await axios.get('http://localhost:5000/api/projects')).data);
    console.log('Users lookup ->', (await axios.get('http://localhost:5000/api/users?email=member@demo.local')).data);
    console.log('All checks passed');
  }catch(e){
    console.error('Error', e.response ? e.response.data : e.message);
    process.exit(1);
  }
}
run();
