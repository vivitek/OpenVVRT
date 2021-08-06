const axios = require("axios")
const BASE_URL = "https://api.digitalocean.com/v2"

const registerUrl = async (id) => {
	try {
		const res = await axios.default.post(`${BASE_URL}/domains/openvivi.com/records`, {
			type:"A",
			name:id,
			data: process.env.DO_SERVER
		}, {
			headers: {
				"Authorization": `Bearer ${process.env.DO_TOKEN}`
			}
		})
	
		if (res.status === 201) {
			return res.data.domain_record
		} else {
			throw "Could not create new record"
		}
	} catch (error) {
		throw error
	}
}

module.exports = {
	registerUrl
}