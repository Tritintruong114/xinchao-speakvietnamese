---
name: senior-engineering
description: Chuyên gia thiết kế kiến trúc sạch (clean architecture), phát triển hướng kiểm thử (TDD), và viết mã backend đạt chuẩn Enterprise.
---

# Goal
Cung cấp hướng dẫn chuyên sâu để xây dựng hệ thống phần mềm có tính mở rộng cao, dễ bảo trì và đạt chất lượng kiểm thử tối ưu thông qua việc áp dụng Clean Architecture, TDD và các nguyên tắc SOLID.

# Instructions
1. **Ưu tiên TDD (Test-Driven Development)**:
   - Luôn viết Unit Test trước khi triển khai bất kỳ logic nghiệp vụ nào.
   - Tuân thủ chu trình: Red (viết test lỗi) -> Green (viết mã để test vượt qua) -> Refactor (tối ưu mã).
2. **Kiến trúc Sạch (Clean Architecture)**:
   - Phân tách rõ ràng các lớp: Entities, Use Cases, Interface Adapters, và Frameworks & Drivers.
   - Đảm bảo Dependency Rule: Các lớp bên trong không được biết về các lớp bên ngoài.
3. **Nguyên tắc SOLID**:
   - **Single Responsibility**: Mỗi class/module chỉ nên có một lý do duy nhất để thay đổi.
   - **Open/Closed**: Mở rộng tính năng mà không sửa đổi mã nguồn hiện có.
   - **Liskov Substitution**: Các object của class con phải có thể thay thế class cha mà không làm hỏng chương trình.
   - **Interface Segregation**: Không bắt buộc client phụ thuộc vào các interface mà họ không dùng.
   - **Dependency Inversion**: Phụ thuộc vào abstraction, không phụ thuộc vào concretion.
4. **Xử lý Edge-cases**:
   - Luôn kiểm tra các giá trị biên, lỗi mạng, lỗi database và các đầu vào không hợp lệ.
   - Sử dụng cơ chế Error Handling nhất quán.

# Examples
### Ví dụ về TDD với Jest:
```javascript
// Step 1: Viết test trước (Red)
test('should calculate total price with tax', () => {
  const cart = new ShoppingCart();
  cart.add({ price: 100, quantity: 2 });
  expect(cart.getTotalWithTax(0.1)).toBe(220);
});

// Step 2: Triển khai logic tối thiểu (Green)
class ShoppingCart {
  constructor() { this.items = []; }
  add(item) { this.items.push(item); }
  getTotalWithTax(taxRate) {
    const subtotal = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return subtotal * (1 + taxRate);
  }
}
```

# Constraints
- Tuyệt đối không viết logic nghiệp vụ phức tạp mà không có Unit Test đi kèm.
- Tránh việc "nhồi nhét" quá nhiều chức năng vào một tệp (vi phạm Single Responsibility).
- Không sử dụng các thư viện bên thứ ba trực tiếp trong lớp Core/Domain (phải thông qua Abstraction).
- Mã nguồn phải được comment rõ ràng về ý đồ thiết kế, đặc biệt là các phần xử lý lỗi phức tạp.
