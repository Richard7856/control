-- System Categories (user_id is null)

-- Income
insert into public.categories (name, type) values
('Salary', 'income'),
('Freelance', 'income'),
('Investment', 'income'),
('Gift', 'income'),
('Other', 'income');

-- Expense
insert into public.categories (name, type) values
('Food', 'expense'),
('Transport', 'expense'),
('Housing', 'expense'),
('Utilities', 'expense'),
('Entertainment', 'expense'),
('Health', 'expense'),
('Shopping', 'expense'),
('Education', 'expense'),
('Travel', 'expense'),
('Other', 'expense');

-- Transfer
insert into public.categories (name, type) values
('Transfer', 'transfer');
