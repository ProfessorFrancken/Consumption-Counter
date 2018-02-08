export function authHeader() {
    // return authorization header with jwt token
    let team = JSON.parse(localStorage.getItem('team'));

    if (team && team.token) {
        return { 'Authorization': 'Bearer ' + team.token };
    } else {
        return {};
    }
}
