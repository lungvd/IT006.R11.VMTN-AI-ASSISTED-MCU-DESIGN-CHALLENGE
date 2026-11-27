# Hướng dẫn triển khai hệ thống xếp hạng chéo

## Phần A — Tạo Google Sheet
1. Đăng nhập tài khoản Google của giảng viên.
2. Tạo một Google Spreadsheet mới trong Google Drive, đặt tên ví dụ: **MCU Peer Ranking**.
3. Mở **Extensions (Tiện ích mở rộng) → Apps Script**.

## Phần B — Cài đặt mã nguồn
1. Trong Apps Script, mở tệp `Code.gs`, thay toàn bộ nội dung bằng tệp [Code.gs](../peer-ranking/Code.gs) trong repository.
2. Nhấn dấu **+** ở mục Files, chọn **HTML**, đặt tên chính xác là `Index`.
3. Dán nội dung từ [Index.html](../peer-ranking/Index.html).
4. Lưu dự án.

## Phần C — Khởi tạo dữ liệu
1. Chọn hàm `setupOnce` trên thanh công cụ.
2. Nhấn **Run** và cấp quyền Google yêu cầu.
3. Quay lại Google Sheet, kiểm tra có ba trang tính:
   - `Ballots`: phiếu xếp hạng được gửi.
   - `AccessCodes`: mã truy cập riêng của 10 nhóm.
   - `Summary`: dành cho bảng tổng hợp / mở rộng quản trị.
4. Gửi riêng mã của từng nhóm trong cột B của `AccessCodes`. Không công khai bảng mã này.

## Phần D — Deploy Web App
1. Trong Apps Script, chọn **Deploy → New deployment**.
2. Chọn loại **Web app**.
3. Description: `MCU Peer Ranking`.
4. **Execute as:** Me.
5. **Who has access:** chọn phạm vi phù hợp với chính sách tài khoản trường. Nếu cho phép sinh viên ngoài tổ chức truy cập, có thể chọn Anyone. Tài khoản Google Workspace có thể bị quản trị viên giới hạn.
6. Nhấn **Deploy**, hoàn tất cấp quyền và sao chép URL Web App.
7. Gửi URL chung cho cả lớp; gửi mã truy cập riêng cho từng nhóm.

## Phần E — Kiểm tra trước khi sử dụng
- Dùng mã của một nhóm để gửi thử phiếu, kiểm tra thông báo thành công.
- Kiểm tra số phiếu đã nhận tăng lên trên dashboard.
- Kiểm tra nhóm không thể tự xếp hạng chính mình hoặc chọn trùng nhóm.
- Kiểm tra mã sai không thể gửi phiếu.
- Có thể gửi lại bằng cùng mã để cập nhật phiếu.
- Chỉ công bố thứ hạng chính thức khi từng nhóm đã nhận đủ 9 phiếu.

## Quy tắc xếp hạng
Mỗi nhóm xếp 9 nhóm còn lại từ hạng 1 đến hạng 9, không đồng hạng. Average Rank càng thấp càng tốt. Khi Average Rank bằng nhau, Borda cao hơn được xếp trên; Borda là tiêu chí phụ tổng hợp, không phải điểm số do nhóm tự chấm.

## Lưu ý vận hành
- Sinh viên chỉ cần URL Web App và mã nhóm; không cấp quyền chỉnh sửa Google Sheet.
- Nếu triển khai với lựa chọn Anyone, đường dẫn dashboard có thể được người khác xem; mã truy cập vẫn cần được giữ riêng.
- Không đăng mã truy cập trong repository công khai hoặc nhóm chat chung.
- Nếu cần đổi toàn bộ mã, giảng viên có thể chạy `regenerateAccessCodes`; thao tác này làm mất hiệu lực mã cũ.
- Nếu chỉnh sửa mã Apps Script sau khi đã Deploy, cần cập nhật deployment (Deploy → Manage deployments → Edit / New version).
