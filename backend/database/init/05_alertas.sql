USE bloco_notas;
-- Registro interno de solicitações. Não representa envio efetivo de SMS/WhatsApp.
CREATE TABLE IF NOT EXISTS ALERTA_EMERGENCIA (
 id_alerta BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, id_usuario INT UNSIGNED NOT NULL, mensagem TEXT NULL,
 latitude DECIMAL(10,7) NULL, longitude DECIMAL(10,7) NULL,
 status ENUM('registrado','em_processamento','enviado','falhou') NOT NULL DEFAULT 'registrado',
 data_alerta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id_alerta),
 KEY idx_alerta_usuario_data (id_usuario, data_alerta),
 CONSTRAINT fk_alerta_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;