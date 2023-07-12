import sendRequest from "./send-request";
const BASE_URL = '/api/results';

export async function newResult(data) {
    return sendRequest(BASE_URL, 'POST', data);
}

export async function getLatest(userId) {
    return sendRequest(`${BASE_URL}/${userId}/latest`);
}

export async function getAverage() {
    return sendRequest(`${BASE_URL}/average`);
}

// export async function getAllByUsername(username) {
//     return sendRequest(`${BASE_URL}/${username}/all`);
// }

export async function getOne(id) {
    return sendRequest(`${BASE_URL}/${id}`);
}

// export async function getMostRecent(username) {
//     return sendRequest(`${BASE_URL}/${username}`);
// }
