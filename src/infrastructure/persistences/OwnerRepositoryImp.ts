import {Repository} from "@infrastructure/Repository.ts";
import {OwnerRepository} from "@domain/repository/OwnerRepository.ts";
import {OwnerRaw} from "@domain/entity/owner/OwnerRaw.ts";
import {OwnerEntity} from "@domain/entity/owner/OwnerEntity.ts";

export class OwnerRepositoryImp extends Repository implements OwnerRepository {
    public find = async (id: number): Promise<OwnerRaw | null> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT owners.id_owner, owners.name, owners.cellphone, owners.url_source,
                       thumbnails.id_thumbnail, thumbnails.url as thumbnail_url
                FROM owners
                JOIN thumbnails ON owners.id_thumbnail = thumbnails.id_thumbnail
                WHERE owners.id_owner = $1
            `;

            const res = await client.query(sql, [id]);
            const row = res.rows[0];
            row.id_thumbnail = BigInt(row.id_thumbnail);
            return row;
        });
    }

    public findByUrlSource = async (url_source: string): Promise<OwnerRaw | null> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT owners.id_owner, owners.name, owners.cellphone, owners.url_source,
                       thumbnails.id_thumbnail, thumbnails.url as thumbnail_url
                FROM owners
                JOIN thumbnails ON owners.id_thumbnail = thumbnails.id_thumbnail
                WHERE owners.url_source = $1
            `;

            const res = await client.query(sql, [url_source]);
            const rows = res.rows;
            if(!rows || rows.length === 0) {
                return null;
            }
            const row = rows[0];
            row.id_thumbnail = BigInt(row.id_thumbnail);
            return row;
        });
    }

    public insert = async (data: OwnerEntity): Promise<number> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO owners (id_thumbnail, name, cellphone, url_source)
                VALUES ($1, $2, $3, $4)
                RETURNING id_owner;
            `;

            const params = [
                data.id_thumbnail,
                data.name,
                data.cellphone,
                data.url_source
            ];
            const res = await client.query(sql, params);

            return res.rows[0].id_owner;
        });
    }

    public update = async (data: OwnerEntity): Promise<void> => {
        return await this.dbScope(async (client) => {
            const sql = `
                UPDATE owners 
                SET id_thumbnail = $1, name = $2, cellphone = $3, url_source = $4
                WHERE id_owner = $5
            `;

            await client.query(sql, [data.id_thumbnail, data.name, data.cellphone, data.url_source]);
        });
    }
}