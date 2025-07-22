import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,       
    iterations: 1, 
};

export default function () {
    const url = 'http://localhost:8081/prescription';
    // const token = 'err4';

    const params = {
       
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`,
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has prescriptions array': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body.prescriptions);
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}