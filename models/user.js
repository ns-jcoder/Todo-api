//user.js

var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');
module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true
				}
			},
			password: {
				type: DataTypes.VIRTUAL,
				allowNull: false,
				validate: {
					len: [7, 100]
				},
				set: function(value) {
					var salt = bcrypt.genSaltSync(10);
					var hashedPassword = bcrypt.hashSync(value, salt);
					this.setDataValue('password', value);
					this.setDataValue('salt', salt);
					this.setDataValue('password_hash', hashedPassword);
				}
			},
			salt: {
				type: DataTypes.STRING
			},
			password_hash: {
				type: DataTypes.STRING
			}
		}, {
			hooks: {
				beforeValidate: function(user, options) {
					if (typeof user.email === 'string') {
						user.email = user.email.toLowerCase();
					}
				}
			},
			classMethods: {
				authenticate: function(body) {
					return new Promise(function(reslove, reject) {
						if (typeof body.email !== 'string' || typeof body.password !== 'string') {
							return reject();
						}

						user.findOne({
							where: {
								email: body.email
							}
						}).then(function(user) {
							if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
								return reject();
							}


							reslove(user);

						}, function(e) {
							reject();
						});
					});
				},
				findByToken: function(token) {
					return new Promise(function(reslove, reject) {
						try {

							var decordedJWT = jwt.verify(token, 'querty098');
							var bytes = cryptojs.AES.decrypt(decordedJWT.token, 'abc123!@#');
							var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

							user.findById(tokenData.id).then(function() {
								if (user) {
									reslove(user);
								} else {
									reject();
								}
							}, function() {
								reject();
							});

						} catch (e) {
							reject();
						}
					});
				}
			},

			instanceMethods: {
				toPublicJSON: function() {
					var json = this.toJSON();
					return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
				},
				generateToken: function(type) {
					if (!_.isString(type)) {
						return undefined;
					}
					try {
						var stringData = JSON.stringify({
							id: this.get('id'),
							type: type
						});
						var encrptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#').toString();
						var token = jwt.sign({
							token: encrptedData
						}, 'querty098');

						return token;
					} catch (e) {
						console.log(e);
						return undefined;
					}
				}
			}
		}

	);
	return user;
};