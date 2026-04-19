'use client';

/**
 * HƯỚNG DẪN THỰC HÀNH: Cách Sử Dụng Chức Năng Lưu Mục (Saved Items)
 * 
 * File này cung cấp các ví dụ thực tế về cách sử dụng chức năng lưu trong ứng dụng.
 * 
 * Bạn có thể áp dụng những ví dụ này vào bất kỳ component nào cần chức năng lưu.
 */

import { useSavedItems } from '@/lib/saved-items-context';
import { Company } from '@/lib/companies-mock-data';
import { Post } from '@/lib/community-mock-data';

/**
 * EXAMPLE 1: Lưu Công Ty
 * ========================
 * Sử dụng trong: CompanyCard, CompanyDetailModal, v.v.
 */
export function SaveCompanyExample() {
  const { addSavedCompany, removeSavedCompany, isSavedCompany } = useSavedItems();

  const company: Company = {
    id: '1',
    name: 'Tech Innovations Vietnam',
    logo: 'https://...',
    // ... other company properties
  } as Company;

  const handleSaveCompany = () => {
    if (isSavedCompany(company.id)) {
      removeSavedCompany(company.id);
    } else {
      addSavedCompany(company);
    }
  };

  return (
    <button onClick={handleSaveCompany}>
      {isSavedCompany(company.id) ? '❌ Bỏ lưu' : '⭐ Lưu công ty'}
    </button>
  );
}

/**
 * EXAMPLE 2: Lưu Bài Viết
 * ========================
 * Sử dụng trong: PostCard, PostDetailModal, v.v.
 */
export function SavePostExample() {
  const { addSavedPost, removeSavedPost, isSavedPost } = useSavedItems();

  const post: Post = {
    id: '1',
    content: 'Tôi vừa được nâng cấp lên Senior Developer...',
    author: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://...',
      role: 'employer',
    },
    category: 'experience',
    // ... other post properties
  } as Post;

  const handleSavePost = () => {
    if (isSavedPost(post.id)) {
      removeSavedPost(post.id);
    } else {
      addSavedPost(post);
    }
  };

  return (
    <button onClick={handleSavePost}>
      {isSavedPost(post.id) ? '❌ Bỏ lưu' : '📌 Lưu bài viết'}
    </button>
  );
}

/**
 * Notes:
 * ======
 * 1. Luôn sử dụng useSavedItems hook để truy cập chức năng lưu
 * 2. Kiểm tra isSaved* trước khi hiển thị UI
 * 3. Dữ liệu được lưu tự động vào localStorage
 * 4. ID phải duy nhất cho mỗi item
 * 5. Component phải được bao bọc bởi SavedItemsProvider (đã có trong layout.tsx)
 */
