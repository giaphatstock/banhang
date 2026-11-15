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
    question: 'Tôi thanh toán như thế nào?',
    answer:
      'Bạn liên hệ qua Zalo, chúng tôi sẽ hướng dẫn thanh toán qua chuyển khoản ngân hàng hoặc ví điện tử. Sau khi nhận được thanh toán, tài khoản sẽ được giao trong vòng 5-15 phút.',
  },
  {
    question: 'Tài khoản có chính hãng không?',
    answer:
      'Có, 100% tài khoản đều là chính hãng được cung cấp từ nguồn gốc rõ ràng. Chúng tôi không cung cấp tài khoản crack hay bẻ khóa. Bạn có thể yên tâm sử dụng.',
  },
  {
    question: 'Thời gian nhận tài khoản là bao lâu?',
    answer:
      'Thông thường 5-15 phút sau khi thanh toán. Trong giờ cao điểm hoặc ngoài giờ hành chính có thể lên đến 30 phút. Chúng tôi luôn cố gắng giao nhanh nhất có thể.',
  },
  {
    question: 'Chính sách bảo hành của tài khoản là gì?',
    answer:
      'Mỗi sản phẩm có thời hạn bảo hành khác nhau (ghi rõ trên từng gói). Trong thời gian bảo hành, nếu tài khoản bị lỗi do phía chúng tôi (không phải do người dùng), chúng tôi sẽ đổi mới hoặc hoàn tiền. Lưu ý: không bảo hành nếu lỗi do sai thao tác từ phía khách.',
  },
  {
    question: 'Tôi có thể dùng trên bao nhiêu thiết bị?',
    answer:
      'Tùy vào từng gói dịch vụ. Hầu hết các gói cho phép dùng trên 1-2 thiết bị. Một số gói như Netflix 4K Premium hỗ trợ 4 màn hình đồng thời. Chi tiết ghi rõ trong phần quyền lợi của từng gói.',
  },
  {
    question: 'Liên hệ hỗ trợ ở đâu nếu có vấn đề?',
    answer:
      'Nhắn tin qua Zalo — đây là kênh hỗ trợ chính và nhanh nhất. Chúng tôi phản hồi trong vòng 5 phút (kể cả buổi tối). Vui lòng gửi kèm tên gói và mô tả vấn đề để được xử lý nhanh.',
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
          <p className="text-slate-400">
            Không tìm thấy câu trả lời? Nhắn Zalo để được hỗ trợ ngay.
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
                <AccordionTrigger className="text-white hover:text-violet-300 transition-colors font-medium text-sm md:text-base py-3">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3 pb-4">
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
