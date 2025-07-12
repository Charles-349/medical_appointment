import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,       
    iterations: 1, 
};

export default function () {
    const url = 'http://localhost:8081/user';

    const params = {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer YOUR_VALID_ADMIN_TOKEN`
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has users array': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body.users);
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}