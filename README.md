# IT006.R11.VMTN — AI-Assisted MCU Design Challenge

Bài tập thiết kế vi điều khiển 16-bit theo nhóm, sử dụng AI như một trợ lý thiết kế và phản biện kỹ thuật. Sinh viên phải kiểm chứng kết quả do AI đề xuất, giải thích quyết định kiến trúc và bảo vệ thiết kế.

## Mục tiêu
- Vận dụng kiến thức về ISA, datapath, ALU, pipeline, bộ nhớ, I/O và đánh giá hiệu năng.
- Thực hành tư duy thiết kế hệ thống số và kiến trúc máy tính.
- Sử dụng AI có trách nhiệm: đặt yêu cầu, kiểm chứng, thử nghiệm và chỉ ra giới hạn của kết quả AI.
- Phát triển kỹ năng làm việc nhóm, trình bày và phản biện kỹ thuật.

## Tổ chức
- 10 nhóm, mỗi nhóm khoảng 5 sinh viên.
- Mỗi nhóm nhận một hướng thách thức khác nhau: ISA, ALU, pipeline, dự đoán nhánh, bộ nhớ, tiết kiệm năng lượng, GPIO/IoT, ngắt và xử lý thời gian thực, kiểm chứng phần cứng có AI hỗ trợ, hoặc tối ưu PPA.
- Các nhóm có thể đề xuất cải tiến ngoài cấu hình nền, nhưng phải nêu rõ lý do, đánh đổi và bằng chứng kiểm thử.

## Cấu hình MCU nền tham khảo
- Kiến trúc dữ liệu và lệnh 16-bit; PC 8-bit, địa chỉ theo word.
- 8 thanh ghi đa dụng, mỗi thanh ghi 16-bit.
- ALU tối thiểu: ADD, SUB, AND, OR, XOR.
- Instruction Memory: 256 × 16-bit; Data Memory: 256 × 16-bit.
- Pipeline 5 giai đoạn: IF, ID, EX, MEM, WB.
- GPIO 16-bit; mục tiêu tần số 50 MHz.
- Tập lệnh tối thiểu: ADD, SUB, AND, OR, XOR, ADDI, LD, ST, BEQ, OUT, HALT.

Đây là cấu hình nền để bắt đầu, không phải giới hạn thiết kế. Mọi thay đổi cần có giải trình và đánh giá tác động.

## Đánh giá chéo giữa các nhóm
Mỗi nhóm xếp hạng 9 nhóm còn lại theo thứ tự từ 1 đến 9, không tự xếp hạng và không đồng hạng. Mỗi nhóm khác phải xuất hiện đúng một lần trong phiếu. Nhóm đánh giá nêu lý do cho lựa chọn đứng đầu và góp ý mang tính xây dựng.

Kết quả tổng hợp:
- **Average Rank**: điểm thứ hạng trung bình mà một nhóm nhận được; càng thấp càng tốt.
- **Borda** dùng làm tiêu chí phụ khi bằng Average Rank: hạng 1 được 9 điểm, hạng 2 được 8 điểm, ..., hạng 9 được 1 điểm.
- Borda chỉ là quy tắc tổng hợp nội bộ, không phải điểm số do sinh viên tự chấm.
- Chỉ công bố thứ hạng chính thức khi đã nhận đủ 9 phiếu hợp lệ; trước đó kết quả chỉ là tạm thời.

## Cấu trúc tài liệu
- `assignment/`: đề bài Word.
- `peer-ranking/`: mã nguồn Apps Script và giao diện xếp hạng.
- `docs/`: hướng dẫn triển khai và vận hành.

## Triển khai hệ thống xếp hạng
Xem [Hướng dẫn triển khai](docs/Deployment_Guide.md) và [README của peer-ranking](peer-ranking/README.md).

## Lưu ý quyền riêng tư
Không đưa thông tin cá nhân nhạy cảm của sinh viên lên repository công khai. Khi triển khai thực tế, nên dùng mã truy cập riêng cho từng nhóm và không công khai nội dung phiếu đánh giá cá nhân.
