"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useCardModel } from '@/hooks/use-card-model';
import { fetcher } from '@/lib/fetcher';
import { CardWithList } from '@/types';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import Header from './header';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Description } from './description';
import Actions from './actions';
import { AuditLog } from '@prisma/client';
import Activity from './activity';

export const CardModel = () => {
    const id = useCardModel((state) => state.id);
    const isOpne = useCardModel((state) => state.isOpen);
    const onclose = useCardModel((state) => state.onClose);

    const { data: cardData } = useQuery<CardWithList>({
      queryKey: ['card', id],
      queryFn: () => fetcher(`/api/cards/${id}`),
    });

    const { data: auditLogsData } = useQuery<AuditLog[]>({
      queryKey: ['card-logs', id],
      queryFn: () => fetcher(`/api/cards/${id}/logs`),
    });

 
  return (
    <Dialog
        open={isOpne}
        onOpenChange={onclose}
    >
        <DialogContent aria-describedby="dialog-description">
        <DialogTitle>
          <VisuallyHidden>Title</VisuallyHidden>
        </DialogTitle>
        <DialogDescription>
          <VisuallyHidden>Description</VisuallyHidden>
        </DialogDescription>
          {!cardData ? <Header.Skeleton /> : <Header data={cardData} /> }
          <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>
            <div className='col-span-3'>
              <div className='w-full space-y-6'>
                {!cardData
                  ? <Description.Skeleton />
                  : <Description data={cardData} />
                }
                {!auditLogsData
                  ? <Activity.Skeleton />
                  : <Activity items={auditLogsData} />
                }
              </div>
            </div>
            {!cardData
              ? <Actions.Skeleton />
              : <Actions data={cardData} />
            }
          </div>
        </DialogContent>
    </Dialog>
  );
};

