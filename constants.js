const JWT_SECRET_KEY = 'JWT_SECRET=33e86ac48e993d06bb3afd382863457e6bca79daf983ec4ba783e75999b1f4a000e686223b87f05659f7f85e0d369a596d32d2df6f76c41fca708c23a7c15488'

const JWT_EXPIRES_IN = '1h'

const SALT_LENGTH = 10

const EMAIL_REGEX = new RegExp(
	"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
)

const MIN_PASSWORD_LENGTH = 4