import Org from '../models/org.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const generateTokens = (org) => {
    const accessToken = jwt.sign(
        { id: org._id, email: org.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
        { id: org._id, email: org.email }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

export async function register(req, res, next) {
    try {
        const { email, password, org_name, org_type } = req.body;
        const existingOrg = await Org.findOne({ email });
        if (existingOrg) {
            return res.status(400).json({ message: 'Organization already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newOrg = new Org({
            email,
            password: hashedPassword,
            org_name,
            org_type
        });
        await newOrg.save();
        const { accessToken, refreshToken } = generateTokens(newOrg);
        newOrg.accessToken = accessToken;
        newOrg.refreshToken = refreshToken;
        await newOrg.save();

        res.status(201).json({
            message: 'Organization registered successfully',
            org: {
                id: newOrg._id,
                email: newOrg.email,
                org_name: newOrg.org_name,
                org_type: newOrg.org_type
            },
            tokens: { accessToken, refreshToken }
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const org = await Org.findOne({ email });
        if (!org) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, org.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = generateTokens(org);
        org.accessToken = accessToken;
        org.refreshToken = refreshToken;
        await org.save();

        res.status(200).json({
            message: 'Login successful',
            org: {
                id: org._id,
                email: org.email,
                org_name: org.org_name,
                org_type: org.org_type,
                org_stars: org.org_stars
            },
            tokens: { accessToken, refreshToken }
        });
    } catch (error) {
        next(error);
    }
}

export async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const org = await Org.findById(decoded.id);
        if (!org || org.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const newTokens = generateTokens(org);
        org.accessToken = newTokens.accessToken;
        org.refreshToken = newTokens.refreshToken;
        await org.save();

        res.status(200).json({
            message: 'Tokens refreshed successfully',
            tokens: newTokens
        });
    } catch (error) {
        next(error);
    }
}