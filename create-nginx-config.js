const { execSync } = require("child_process");
const fs = require("fs");

const createSymLink = (domain) => {
  try {
    execSync(
      `sudo ln -s /etc/nginx/sites-available/${domain}.conf /etc/nginx/sites-enabled`
    );
  } catch (error) {
    console.error(`Could not create symbolic link for domain ${domain}`);
  }
};

const restartNginx = () => {
  execSync("sudo systemctl restart nginx");
};

const generateCertificate = (domain) => {
  execSync(`sudo certbot --nginx --domain ${domain}`);
};

const generateConfig = async (domain, port) => {
  const sampleFile = fs.readFileSync("./config/sample_conf.conf");
  const sampleFileString = sampleFile
    .toString()
    .replace("example.com", domain)
    .replace(":1111", ":" + port);
  try {
    fs.writeFileSync(
      `/etc/nginx/sites-available/${domain}.conf`,
      sampleFileString
    );
    createSymLink(domain);
    restartNginx();
    generateCertificate(domain);
  } catch (error) {
    console.error("something went wrong while trying to execute commands.");
  }
};

module.exports = { generateConfig };
