import type { ServiceKey } from './services'
import { getPool } from './db'

export type PaymentStatus = 'unverified' | 'pending' | 'paid' | 'failed'

export type ServiceRequest = {
  id: string
  serviceKey: ServiceKey
  customerName: string
  email: string
  phone?: string | null
  message?: string | null
  paymentStatus: PaymentStatus
  stripeSessionId?: string | null
  stripeReference?: string | null
  createdAt: string
  updatedAt: string
}

export async function createOrUpdateServiceRequest(input: {
  serviceKey: ServiceKey
  customerName: string
  email: string
  phone?: string
  message?: string
  paymentStatus: PaymentStatus
  stripeSessionId?: string
  stripeReference?: string
}): Promise<ServiceRequest> {
  const pool = getPool()
  const now = new Date()

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  if (input.stripeSessionId) {
    const result = await pool.query(
      `
      INSERT INTO service_requests (
        id, service_key, customer_name, email, phone, message,
        payment_status, stripe_session_id, stripe_reference, created_at, updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (stripe_session_id)
      DO UPDATE SET
        service_key = EXCLUDED.service_key,
        customer_name = EXCLUDED.customer_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        message = EXCLUDED.message,
        payment_status = EXCLUDED.payment_status,
        stripe_reference = COALESCE(EXCLUDED.stripe_reference, service_requests.stripe_reference),
        updated_at = EXCLUDED.updated_at
      RETURNING *
    `,
      [
        id,
        input.serviceKey,
        input.customerName,
        input.email,
        input.phone ?? null,
        input.message ?? null,
        input.paymentStatus,
        input.stripeSessionId,
        input.stripeReference ?? null,
        now,
        now,
      ],
    )
    const row = result.rows[0]
    return {
      id: row.id,
      serviceKey: row.service_key,
      customerName: row.customer_name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      paymentStatus: row.payment_status,
      stripeSessionId: row.stripe_session_id,
      stripeReference: row.stripe_reference,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    }
  }

  const result = await pool.query(
    `
    INSERT INTO service_requests (
      id, service_key, customer_name, email, phone, message,
      payment_status, stripe_session_id, stripe_reference, created_at, updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
  `,
    [
      id,
      input.serviceKey,
      input.customerName,
      input.email,
      input.phone ?? null,
      input.message ?? null,
      input.paymentStatus,
      input.stripeSessionId ?? null,
      input.stripeReference ?? null,
      now,
      now,
    ],
  )
  const row = result.rows[0]
  return {
    id: row.id,
    serviceKey: row.service_key,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    paymentStatus: row.payment_status,
    stripeSessionId: row.stripe_session_id,
    stripeReference: row.stripe_reference,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

export async function updatePaymentStatusBySessionId(
  stripeSessionId: string,
  paymentStatus: PaymentStatus,
  stripeReference?: string,
) {
  const pool = getPool()
  await pool.query(
    `
    UPDATE service_requests
    SET payment_status = $1,
        stripe_reference = COALESCE($2, stripe_reference),
        updated_at = NOW()
    WHERE stripe_session_id = $3
  `,
    [paymentStatus, stripeReference ?? null, stripeSessionId],
  )
}

export async function listRecentServiceRequests(limit = 50): Promise<ServiceRequest[]> {
  const pool = getPool()
  const result = await pool.query(
    `
    SELECT id, service_key, customer_name, email, phone, message,
           payment_status, stripe_session_id, stripe_reference,
           created_at, updated_at
    FROM service_requests
    ORDER BY created_at DESC
    LIMIT $1
  `,
    [limit],
  )
  return result.rows.map((row) => ({
    id: row.id,
    serviceKey: row.service_key,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    paymentStatus: row.payment_status,
    stripeSessionId: row.stripe_session_id,
    stripeReference: row.stripe_reference,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }))
}


