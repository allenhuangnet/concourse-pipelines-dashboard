var config = {}
config.concourse_url = process.env.CONCOURSE_URL || "https://ci.concourse.ci"; //Replace with your concourse url
config.api_subdirectory = "/api/v1";
config.concourse_username = process.env.CONCOURSE_USERNAME || "user";
config.concourse_password = process.env.CONCOURSE_PASSWORD || "password";
config.concourse_team= process.env.CONCOURSE_TEAM || "main"
config.use_bearer_token= process.env.CONCOURSE_USE_BEARER || false
config.enable_basic_auth = process.env.CONCOURSE_ENABLE_BASIC_AUTH || true
config.basic_auth_user = process.env.CONCOURSE_BASIC_AUTH_USER || "admin"
config.basic_auth_password = process.env.CONCOURSE_BASIC_AUTH_PASSWORD || "password"

module.exports = config;
