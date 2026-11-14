USE bloco_notas;
CREATE TABLE IF NOT EXISTS USUARIO (
 id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT, nome VARCHAR(120) NOT NULL, telefone VARCHAR(20) NOT NULL,
 senha_hash VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt da senha de login',
 senha_cofre VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt do PIN da área restrita',
 ativo BOOLEAN NOT NULL DEFAULT TRUE, data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (id_usuario), UNIQUE KEY uk_usuario_telefone (telefone), KEY idx_usuario_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;