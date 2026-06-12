import didYouMean from 'didyoumean2';

const knownEmailDomains = [
  'gmail.com', 'yahoo.com', 'yandex.ru', 'mail.ru',
  'icloud.com', 'outlook.com', 'proton.me', 'rambler.ru', 'bk.ru', 'list.ru', 'inbox.ru'
];

export function isValidEmailSyntax(email) {
  const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
  return EMAIL_REGEXP.test(email);
}

export function getEmailSuggestion(email) {
  const match = email.toLowerCase().match(/@(.+)$/);
  if (!match) return null;

  const domain = match[1];
  const suggestion = didYouMean(domain, knownEmailDomains);

  if (suggestion && suggestion !== domain) {
    return email.replace(domain, suggestion);
  }

  return null;
}

export function validatePassword(password) {
  return password.length >= 6;
}

export function validateUsername(username) {
  const USERNAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ]{2,}$/u;
  return USERNAME_REGEX.test(username.trim());
}


export function validateConfirmPassword(password, confirmPassword) {
  return password === confirmPassword;
}