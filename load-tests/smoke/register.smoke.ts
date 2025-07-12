import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,     
    iterations: 3, 
    duration: '15s',
};

function randomEmail(): string {
    return `user${Math.floor(Math.random() * 1000000)}@example.com`;
}

export default function () {
    const url = 'http://localhost:8081/user';

    const payload = JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: randomEmail(),
        password: 'TestPassword',
        contactPhone: '0701656349',
        address: '123 Nyeri',
        role: 'user'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
         
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 201': (r) => r.status === 201,
        'message present': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return body.message !== undefined;
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}