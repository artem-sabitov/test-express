function Customer(email, phone, encryptedEmail) {
    this.email = email;
    this.phone = phone;
    this.encryptedEmail = encryptedEmail;

    this.getEmail = function () {
        return this.email;
    };
    this.getPhone = function () {
        return this.phone;
    };
    this.getEncryptedEmail = function () {
        return this.encryptedEmail;
    };
}

module.exports = Customer;
