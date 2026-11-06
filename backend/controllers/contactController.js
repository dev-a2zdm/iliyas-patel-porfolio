import pool from '../config/db.js';
import { validateContactInput } from '../validators/contactValidator.js';

/**
 * Handle new contact message submission
 * POST /api/contact
 */
export async function submitContact(req, res, next) {
  try {
    const { isValid, errors, sanitizedData } = validateContactInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Please correct the errors in the form.',
        errors,
      });
    }

    const { name, email, phone, subject, message } = sanitizedData;

    // Extract client IP address safely (supporting proxies / Hostinger load balancers)
    const forwardedHeader = req.headers['x-forwarded-for'];
    const ipAddress = forwardedHeader
      ? forwardedHeader.split(',')[0].trim()
      : (req.socket?.remoteAddress || req.ip || null);

    const userAgent = req.headers['user-agent'] ? req.headers['user-agent'].substring(0, 255) : null;

    // Duplicate check: Prevent identical submissions from same email within 2 minutes
    const [recentSubmissions] = await pool.execute(
      `SELECT id FROM contact_messages 
       WHERE email = ? AND subject = ? AND created_at > (NOW() - INTERVAL 2 MINUTE) 
       LIMIT 1`,
      [email, subject]
    );

    if (recentSubmissions.length > 0) {
      return res.status(429).json({
        success: false,
        message: 'A similar message was recently submitted. Please wait a couple of minutes before submitting again.',
      });
    }

    // Insert sanitized record using parameterized SQL query
    const insertSql = `
      INSERT INTO contact_messages (name, email, phone, subject, message, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(insertSql, [
      name,
      email,
      phone,
      subject,
      message,
      ipAddress ? ipAddress.substring(0, 45) : null,
      userAgent,
    ]);

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received successfully.',
      data: {
        id: result.insertId,
        name,
        email,
        phone,
        subject,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

