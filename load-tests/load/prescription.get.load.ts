import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';

export const options = {
  stages: [
    { duration: '30s', target: 500 }, 
    { duration: '50s', target: 2500 },  
    { duration: '10s', target: 80 },  
  ],
  ext: {
    loadimpact: {
      name: 'Prescriptions GET Load Test',
    },
  },
//   thresholds: {
//     http_req_duration: ['p(95)<500'], // 95% of requests should complete below 500ms
//     checks: ['rate>0.95'], // 95% of checks should pass
//   },
};

export default function () {
  // const token = 'err4';
  const res = http.get(`${BASE_URL}/prescription`, {
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

    'has prescriptions array': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return Array.isArray(body.prescriptions);
      } catch {
        return false;
      }
    },

    'prescriptions array not empty': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return body.prescriptions.length > 0;
      } catch {
        return false;
      }
    },

    'each prescription has prescriptionID': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return body.prescriptions.every((p) => p.prescriptionID !== undefined);
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
