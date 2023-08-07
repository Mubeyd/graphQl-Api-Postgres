import { ApolloError } from 'apollo-server-core'
import { Arg, Mutation, Resolver } from 'type-graphql'
import sendEmail from '../../utils/mailer'
import { OrderCreateInput, OrderDto, OrderResponse } from './order.dto'
import { createOrder } from './order.service'

import { getEmailSubjectOrderLocalized } from '../../utils/getEmailSubjectLocalized'
import { orderAttachments, orderHtmlTemplate } from '../../utils/orderHtmlTemplate'

@Resolver(() => OrderDto)
class OrderResolver {
  @Mutation(() => OrderResponse)
  async createOrder(@Arg('input') input: OrderCreateInput) {
    try {
      const order = await createOrder({ input })

      if (!order) {
        throw new ApolloError('Error occurred while creating order')
      }

      const htmlTemplateWithOrder = orderHtmlTemplate({ order, locale: input.locale })

      const getEmailSubjectOrderLocalizedS = getEmailSubjectOrderLocalized({ locale: input.locale })

      // Send email to admin

      await sendEmail({
        to: 'info@your-domain.com',
        from: 'info@your-domain.com',
        // cc: ['support@your-domain.com'],
        subject: getEmailSubjectOrderLocalizedS,
        html: htmlTemplateWithOrder,
        attachments: orderAttachments
      })

      // Send email to user

      await sendEmail({
        to: order.anonymUser?.email,
        from: 'info@your-domain.com',
        subject: getEmailSubjectOrderLocalizedS,
        html: htmlTemplateWithOrder,
        attachments: orderAttachments
      })

      return { id: order.id }
    } catch (e: any) {
      throw new ApolloError('Error occurred while creating order')
    }
  }
}

export default OrderResolver
