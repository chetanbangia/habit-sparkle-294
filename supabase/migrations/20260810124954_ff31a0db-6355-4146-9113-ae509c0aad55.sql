
CREATE POLICY "Users upload own payment proofs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payment-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users read own payment proofs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'payment-proofs' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR (storage.foldername(name))[1] = 'qr'
      OR has_role(auth.uid(), 'admin'::app_role)
    )
  );

CREATE POLICY "Admins manage payment proofs" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'payment-proofs' AND has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'payment-proofs' AND has_role(auth.uid(), 'admin'::app_role));
