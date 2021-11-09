const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const NGINX_PATH = "/etc/nginx/sites-available";

const createSymLink = (domain) => {
  try {
    execSync(
      `sudo ln -s ${NGINX_PATH}/${domain}.conf /etc/nginx/sites-enabled`
    );
  } catch (error) {
    console.error(`Could not create symbolic link for domain ${domain}`);
  }
};

const restartNginx = () => {
  execSync("sudo systemctl restart nginx");
};

const generateCertificate = (domain) => {
  try {
     execSync(`sudo certbot -n --redirect --nginx --domain ${domain}`);
  } catch (e) {
     console.log(`could not get certificate: ${error}`)
  }
};

const generateConfig = async (id, port) => {
  const domain = `${id}.openvivi.com`;
  const sampleFile = fs.readFileSync("./config/sample_conf.conf");
  const sampleFileString = sampleFile
    .toString()
    .replace("example.com", domain)
    .replace(":1111", ":" + port);
  try {
    fs.writeFileSync(`${NGINX_PATH}/${domain}.conf`, sampleFileString);
    createSymLink(domain);
    restartNginx();
    generateCertificate(domain);
  } catch (error) {
    console.error("something went wrong while trying to execute commands.");
  }
};

const isDomainAvailable = async (domain) => {
  return !fs.existsSync(`${NGINX_PATH}/${domain}.conf`);
};

const isPortAvailable = (port) => {
  fs.readdirSync(NGINX_PATH).forEach((e) => {
    const p = path.resolve(NGINX_PATH, e);
    const content = fs.readFileSync(p);
    if (content.includes(`:${port}`)) {
      return false;
    }
  });
  return true;
};

module.exports = { generateConfig, isDomainAvailable, isPortAvailable };
