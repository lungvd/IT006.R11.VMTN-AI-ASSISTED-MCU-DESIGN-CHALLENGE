# AI-ASSISTED MCU DESIGN CHALLENGE
## DESIGN YOUR OWN 16-BIT MICROCONTROLLER

**Học phần:** Kiến trúc máy tính (Computer Architecture)  
**Đối tượng:** Lớp tài năng – Định hướng thiết kế vi mạch  
**Hình thức:** Làm việc theo nhóm, sử dụng AI hỗ trợ thiết kế và phản biện kỹ thuật  
**Quy mô:** 10 nhóm, mỗi nhóm khoảng 5 sinh viên

## PHẦN I. BỐI CẢNH VÀ THỬ THÁCH

### 1. Câu chuyện đặt vấn đề
Giả sử nhóm của các bạn vừa được tuyển vào bộ phận R&D của một công ty thiết kế vi mạch (Fabless Semiconductor Company). Công ty đang có kế hoạch phát triển một dòng vi điều khiển (Microcontroller – MCU) 16-bit dành cho các thiết bị IoT và hệ thống nhúng thông minh.

Ban lãnh đạo giao cho nhóm kỹ sư trẻ nhiệm vụ: tự thiết kế kiến trúc một MCU 16-bit từ đầu, sử dụng AI như một kỹ sư hỗ trợ thiết kế, nhưng phải đảm bảo thiết kế có tính đúng đắn về mặt kiến trúc máy tính và có khả năng hiện thực hóa bằng phần cứng.

Các bạn không được lấy nguyên thiết kế MIPS trong giáo trình rồi thay đổi tên các thanh ghi. Các bạn phải đưa ra những quyết định thiết kế của riêng mình, giải thích tại sao chọn như vậy và chứng minh thiết kế hoạt động đúng.

### 2. Nhiệm vụ tổng quát
Mỗi nhóm phải hoàn thành một bản thiết kế MCU 16-bit bao gồm:
- Thiết kế Instruction Set Architecture (ISA).
- Thiết kế cấu trúc Datapath.
- Thiết kế Control Unit.
- Thiết kế Pipeline.
- Xử lý Data Hazard và Control Hazard.
- Thiết kế bộ nhớ và hệ thống vào/ra.
- Sử dụng AI hỗ trợ sinh mã Verilog và kiểm thử thiết kế.
- Đánh giá khả năng triển khai trên FPGA.

## PHẦN II. ĐẶC TẢ KỸ THUẬT BAN ĐẦU

Tất cả 10 nhóm sử dụng cùng một bộ yêu cầu nền tảng. Tuy nhiên, mỗi nhóm sẽ có một nhiệm vụ mở rộng khác nhau.

### 1. Cấu hình MCU

| Thành phần | Yêu cầu |
|---|---|
| Data width | 16-bit |
| Instruction width | 16-bit |
| PC | 8-bit, địa chỉ theo word |
| Register File | 8 thanh ghi, mỗi thanh ghi 16-bit |
| ALU | Tối thiểu 5 phép toán |
| Instruction Memory | 256 × 16-bit |
| Data Memory | 256 × 16-bit |
| Pipeline | 5 giai đoạn |
| I/O GPIO | 16-bit |
| Clock mục tiêu | 50 MHz |
| Công cụ thiết kế | AI + Verilog + Simulator |

Có thể đưa ra các cải tiến khác cấu hình trên, nhưng phải giải thích được lý do và đánh giá ảnh hưởng.

### 2. Thiết kế tập lệnh ISA
MCU phải hỗ trợ tối thiểu các lệnh sau:

| Nhóm lệnh | Instruction | Chức năng |
|---|---|---|
| Arithmetic | ADD | Cộng hai thanh ghi |
| Arithmetic | SUB | Trừ hai thanh ghi |
| Logic | AND | AND hai thanh ghi |
| Logic | OR | OR hai thanh ghi |
| Logic | XOR | XOR hai thanh ghi |
| Immediate | ADDI | Cộng với hằng số |
| Memory | LD | Đọc dữ liệu từ bộ nhớ |
| Memory | ST | Ghi dữ liệu vào bộ nhớ |
| Branch | BEQ | Nhảy nếu hai thanh ghi bằng nhau |
| I/O | OUT | Xuất dữ liệu ra GPIO |
| Control | HALT | Dừng chương trình |

Các nhóm được phép đề xuất thêm lệnh mới.

### 3. Thiết kế định dạng lệnh
Một gợi ý để bắt đầu thiết kế là sử dụng định dạng 16-bit với các trường:
- **R-type:** Opcode (4 bit), RD (3 bit), RS (3 bit), RT (3 bit), Function (3 bit).
- **I-type:** Opcode (4 bit), Register (3 bit), Immediate (9 bit).
- **Branch-type:** Opcode (4 bit), RS (3 bit), RT (3 bit), Offset (6 bit).
- **Memory-type:** Opcode (4 bit), RT (3 bit), Base (3 bit), Offset (6 bit).

Các nhóm phải xác định rõ cách mã hóa từng lệnh, phạm vi giá trị Immediate, cách tính địa chỉ và cách giải mã lệnh.

Lưu ý: Đây là kiến trúc do nhóm tự thiết kế, không bắt buộc phải sử dụng chính xác các định dạng trên nếu có phương án tốt hơn.

### 4. Thiết kế Pipeline
MCU phải có 5 giai đoạn:
- IF – Instruction Fetch.
- ID – Instruction Decode.
- EX – Execute.
- MEM – Memory Access.
- WB – Write Back.

Tuy nhiên, các nhóm phải tự quyết định và giải thích:
- Các thanh ghi Pipeline cần có.
- Tín hiệu điều khiển được truyền qua từng giai đoạn.
- Khi nào cần Forwarding?
- Khi nào cần Stall?
- Khi nào cần Flush?
- Điều gì xảy ra khi gặp lệnh BEQ?
- Điều gì xảy ra khi lệnh LD ngay trước một lệnh sử dụng kết quả vừa đọc?

**Yêu cầu quan trọng:** Không chỉ vẽ được 5 tầng Pipeline, mà phải chứng minh được một chuỗi lệnh thực sự hoạt động chính xác qua các tầng.

### 5. Thiết kế hệ thống ngoại vi
MCU cần có khả năng giao tiếp với thế giới bên ngoài. Các nhóm phải đề xuất cách kết nối GPIO với Datapath và xác định cách CPU truy cập thanh ghi ngoại vi. Ví dụ: chương trình đọc dữ liệu cảm biến, xử lý dữ liệu và xuất kết quả ra GPIO.

## PHẦN III. THỬ THÁCH RIÊNG CHO 10 NHÓM

Ngoài thiết kế nền tảng, mỗi nhóm nhận một nhiệm vụ chuyên sâu. Đây là phần tạo nên sự khác biệt giữa các nhóm.

### Nhóm 1 – ISA Innovation: Thiết kế tập lệnh thông minh
- Đề xuất ít nhất 2 lệnh mới ngoài ISA cơ bản.
- Giải thích vì sao cần bổ sung các lệnh này.
- Thiết kế cách mã hóa lệnh 16-bit.
- Phân tích ảnh hưởng đến Instruction Decoder và Datapath.
- So sánh số lệnh và độ phức tạp khi thực hiện một thuật toán trước và sau khi bổ sung lệnh mới.

### Nhóm 2 – ALU Innovation: Thiết kế ALU tối ưu
- Thiết kế ALU 16-bit.
- Đề xuất kiến trúc cộng và trừ.
- So sánh Ripple Carry Adder với một kiến trúc cộng nhanh hơn.
- Đánh giá ảnh hưởng đến diện tích và độ trễ.
- Đề xuất cách bổ sung một phép toán đặc biệt.

### Nhóm 3 – Pipeline Optimization: Tối ưu hóa Pipeline
- Thiết kế đầy đủ 5 giai đoạn Pipeline.
- Phân tích Data Hazard.
- Đề xuất Forwarding Unit.
- Xây dựng một ví dụ có Load-Use Hazard.
- Chứng minh cách xử lý Stall và Forwarding.

### Nhóm 4 – Branch Prediction: Thiết kế cơ chế dự đoán nhánh
- Đề xuất cách xử lý lệnh BEQ.
- So sánh xử lý nhánh theo kiểu dự đoán không nhảy và dự đoán luôn nhảy.
- Đề xuất cơ chế Branch Prediction đơn giản.
- Phân tích số chu kỳ bị lãng phí khi dự đoán sai.
- Đề xuất phương án giảm Control Hazard.

### Nhóm 5 – Memory Architecture: Thiết kế hệ thống bộ nhớ
- Thiết kế Instruction Memory và Data Memory.
- Đề xuất cách tổ chức địa chỉ.
- Phân tích Harvard Architecture và Von Neumann Architecture.
- Đề xuất cơ chế truy cập dữ liệu hiệu quả.
- Phân tích ảnh hưởng của bộ nhớ đến hiệu năng CPU.

### Nhóm 6 – Low Power Design: Thiết kế MCU tiết kiệm năng lượng
- Xác định các thành phần tiêu thụ năng lượng.
- Đề xuất Clock Gating.
- Đề xuất chế độ Sleep hoặc Low Power.
- Phân tích sự đánh đổi giữa hiệu năng và năng lượng.
- Đề xuất cách hiện thực hóa chức năng tiết kiệm điện.

### Nhóm 7 – GPIO & Embedded Applications: Thiết kế MCU cho ứng dụng IoT
- Thiết kế giao tiếp GPIO.
- Đề xuất cơ chế Memory-Mapped I/O.
- Thiết kế chương trình đọc dữ liệu cảm biến.
- Xây dựng chương trình xử lý và xuất dữ liệu.
- Phân tích cách CPU tương tác với thiết bị ngoại vi.

### Nhóm 8 – Interrupt & Real-Time Processing: Thiết kế cơ chế ngắt
- Đề xuất cơ chế Interrupt.
- Thiết kế cách CPU lưu trạng thái khi có ngắt.
- Xác định cách quay lại chương trình chính.
- Phân tích ảnh hưởng của ngắt đến Pipeline.
- Đề xuất giải pháp ưu tiên ngắt.

### Nhóm 9 – Hardware Verification: Kiểm chứng thiết kế bằng AI
- Sử dụng AI sinh mã Verilog cho một số module.
- Xây dựng Testbench.
- Kiểm thử các trường hợp bình thường và bất thường.
- Tìm ít nhất một lỗi logic do AI tạo ra hoặc do nhóm chủ động đưa vào.
- Chứng minh cách phát hiện và sửa lỗi.

### Nhóm 10 – PPA Optimization: Tối ưu hóa thiết kế phần cứng
- Phân tích Power, Performance và Area (PPA).
- Xác định đường truyền dữ liệu có độ trễ lớn.
- Đề xuất phương án tối ưu.
- Phân tích ảnh hưởng của tối ưu hóa đến diện tích và tốc độ.
- Đề xuất khả năng triển khai MCU trên FPGA.

## PHẦN IV. ĐÁNH GIÁ CHÉO VÀ XẾP HẠNG GIỮA CÁC NHÓM

Sau khi xem sản phẩm và phần trình bày của các nhóm, mỗi nhóm thực hiện xếp hạng 9 nhóm còn lại. Hoạt động này là xếp hạng đồng đẳng (Peer Ranking), không phải chấm điểm.

- Mỗi nhóm xếp 9 nhóm còn lại theo thứ tự từ hạng 1 (tốt nhất) đến hạng 9.
- Không xếp hạng nhóm mình; mỗi nhóm khác chỉ được xuất hiện một lần trong phiếu.
- Không sử dụng đồng hạng. Việc xếp hạng phải căn cứ vào chất lượng kỹ thuật, tính nhất quán của kiến trúc, khả năng xử lý pipeline/hazard, tính sáng tạo và khả năng giải thích, bảo vệ thiết kế.
- Mỗi phiếu cần nêu ngắn gọn lý do chọn nhóm ở hạng 1 và một nhận xét có ích cho nhóm được đánh giá.
- Không trao đổi hoặc thống nhất thứ hạng với nhóm khác trước khi nộp phiếu.

### Tổng hợp thứ hạng chung
Ban tổ chức quy đổi thứ hạng để tổng hợp bằng phương pháp Borda Count: hạng 1 được 9 điểm quy đổi, hạng 2 được 8 điểm, …, hạng 9 được 1 điểm. Đây chỉ là giá trị tính toán nội bộ, không phải điểm học tập. Điểm trung bình thứ hạng (Average Rank) của mỗi nhóm được tính từ các thứ hạng mà nhóm đó nhận được; thứ hạng chung được sắp xếp theo Average Rank tăng dần. Nếu bằng nhau, dùng tổng điểm Borda cao hơn làm tiêu chí phụ.

**Lưu ý:** Mỗi nhóm phải nộp một phiếu xếp hạng. Giảng viên tổng hợp kết quả sau khi nhận đủ 10 phiếu.
