INSERT INTO folders ("name")
VALUES
  ('Folder One'),
  ('Folder Two'),
  ('Folder Three')
;

INSERT INTO notes ("name", content, folder_id)
VALUES
  ('Note One', 'Hey there from Angela!', 1),
  ('Note Two', 'This is another note', 2),
  ('Note Three', 'Are you reading these?', 3)
;