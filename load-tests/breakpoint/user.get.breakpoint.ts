import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';

export const options = {
  stages: [
    { duration: '20s', target: 500 }, 
    { duration: '3m', target: 5000 }, 
    { duration: '20s', target: 500 },  
  ],
  ext: {
    loadimpact: {
      name: 'Users GET Load Test',
    },
  },
//   thresholds: {
//     http_req_duration: ['p(95)<500'], // 95% of requests should complete below 500ms
//     checks: ['rate>0.95'], // 95% of checks should pass
//   },
};

export default function () {
  // const token = 'err4';
  const res = http.get(`${BASE_URL}/user`, {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,

    'response is JSON': (r) => {
      try {
        JSON.parse(r.body as string);
        return true;
      } catch {
        return false;
      }
    },

    'has users array': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return Array.isArray(body.users);
      } catch {
        return false;
      }
    },

    'users array not empty': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return body.users.length > 0;
      } catch {
        return false;
      }
    },

    'each user has userID': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return body.users.every((u) => u.userID !== undefined);
      } catch {
        return false;
      }
    },

    'each user has email': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return body.users.every((u) => typeof u.email === 'string');
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
