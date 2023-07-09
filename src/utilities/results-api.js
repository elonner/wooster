import sendRequest from "./send-request";
const BASE_URL = '/api/results';

export async function newResult(username) {
    return sendRequest(BASE_URL, 'POST', username);
}

export async function getAll(id) {
    return sendRequest(`${BASE_URL}/${id}/all`);
}

export async function getAllByUsername(username) {
    return sendRequest(`${BASE_URL}/${username}/all`);
}

export async function getOne(id) {
    return sendRequest(`${BASE_URL}/${id}`);
}

export async function getByUsername(username) {
    return sendRequest(`${BASE_URL}/${username}`);
}
