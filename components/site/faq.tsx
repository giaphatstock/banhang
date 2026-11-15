'use client'

// ============================================================
// components/site/faq.tsx
// FAQ dạng accordion dùng shadcn Accordion
// ============================================================
import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Tài khoản có chính hãng không?',
    answer:
      'Có, 100% tài khoản đều là chính hãng được cung cấp từ nguồn gốc rõ ràng. Chúng tôi tuyệt đối không cung cấp tài khoản crack hay bẻ khóa. Bạn có thể hoàn toàn yên tâm sử dụng.',
  },
  {
    question: 'Thời gian nhận tài khoản là bao lâu?',
    answer:
      'Tùy lúc nhưng cam kết sẽ xử lí tất cả đơn trong ngày.',
  },
  {
    question: 'Liên hệ hỗ trợ ở đâu nếu có vấn đề?',
    answer:
      'Nhắn tin qua Zalo — đây là kênh hỗ trợ chính và nhanh nhất. Chúng tôi phản hồi sớm nhất có thể, cam kết luôn đồng hành cùng khách hàng.',
  },
  {
    question: 'Tôi thanh toán như thế nào?',
    answer:
      'Bạn bấm "Mua ngay" hoặc nhắn tin qua Zalo, chúng tôi sẽ hướng dẫn chi tiết phương thức thanh toán (chuyển khoản ngân hàng / ví điện tử). Sau khi kích hoạt và kiểm tra tài khoản hoạt động ổn định, bạn mới hoàn tất thanh toán.',
  },
  {
    question: 'Chính sách bảo hành của tài khoản là gì?',
    answer:
      'Mỗi sản phẩm có quy định và thời hạn bảo hành riêng được ghi rõ ràng trên từng gói. Trong thời gian bảo hành, cam kết hoàn tiền hoặc đổi mới nếu sản phẩm gặp vấn đề theo đúng quy định. Không hỏi nhiều.',
  },
  {
    question: 'Tôi có thể dùng trên bao nhiêu thiết bị?',
    answer:
      'Tùy vào từng gói dịch vụ. Hầu hết các gói tài khoản cá nhân cho phép đăng nhập trên 1-2 thiết bị cá nhân (điện thoại, máy tính). Chi tiết được hướng dẫn cụ thể khi bàn giao tài khoản.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Câu hỏi
            <span className="gradient-text"> thường gặp</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Không tìm thấy câu trả lời? Nhắn Zalo để được hỗ trợ nhanh nhất.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Accordion className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="glass-card rounded-xl border border-white/8 px-4 py-1"
              >
                <AccordionTrigger className="text-white hover:text-violet-300 transition-colors font-medium text-sm md:text-base py-3.5 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-300/90 leading-relaxed border-t border-white/5 pt-3 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
