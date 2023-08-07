import { Locale } from '../modules/common/common.dto'
import { OrderWithRelations, Prisma } from './prisma'

import fs from 'fs'

// Read image file
const image = fs.readFileSync('src/assets/logo/ubeyd.png')

// Encode image data to base64
const encodedImage = Buffer.from(image).toString('base64')

// Define email attachments
export const orderAttachments = [
  {
    filename: 'image.png',
    content: encodedImage,
    cid: 'image@myimage',
    encoding: 'base64'
  }
]

export function orderHtmlTemplate({ order, locale }: { order: OrderWithRelations; locale: Locale }) {
  const { anonymUser, features } = order

  const featuresList = features.map(feature => {
    const { nameTxJson, descriptionTxJson, price } = feature

    return `
        <li>
            <h3>${(nameTxJson as Prisma.JsonObject)[locale]}</h3>
            <p>${(descriptionTxJson as Prisma.JsonObject)[locale]}</p>
            <p>${price}</p>
        </li>
        `
  })

  return `
        <div style="text-align: center;">
          <img src="cid:image@myimage" alt="Muhammed Ubeyd" width="150">
        </div>

        <h1>Order</h1>
        <h2>Features</h2>
        <ul>
        ${featuresList.join('')}
        </ul>
        <h2>Customer</h2>
        <p>${anonymUser?.fullName}</p>
        <p>${anonymUser?.email}</p>
        <p>${anonymUser?.phone}</p>
        <p>${anonymUser?.companyName}</p>
        <p>${anonymUser?.country}</p>

        <h2>Message</h2>
        <p>${order?.message}</p>
    `
}
