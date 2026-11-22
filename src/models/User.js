import { DataTypes } from "sequelize";
import bcrypt from 'bcryptjs';
import sequelize from "../db.js";

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Имя не должно быть пустым'
            },
            len: {
                args: [2, 30],
                msg: 'Имя должно содержать от 2 до 30 символов'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Введите коректный email'
            },
            notEmpty: {
                msg: 'Email не должен быть пустым'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 100],
                msg: 'Пароль должнен содержать от 6 до 100 символов'
            }
        }
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

export default User;