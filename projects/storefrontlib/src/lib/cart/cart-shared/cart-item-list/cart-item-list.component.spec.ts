import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CartService } from '@spartacus/core';
import { CartItemComponent } from '../../cart-shared/cart-item/cart-item.component';
import { ComponentsModule } from '../../../ui/components/components.module';

import { CartItemListComponent } from './cart-item-list.component';
import { Pipe, PipeTransform } from '@angular/core';

class MockCartService {
  removeEntry() {}
  loadDetails() {}
  updateEntry() {}
}

const mockItems = [
  {
    id: 1,
    quantity: 5,
    entryNumber: 1,
    product: {
      id: 1,
      code: 'PR0000'
    }
  }
];

const mockPotentialProductPromotions = [
  {
    description: 'Buy two more and win a trip to the Moon',
    consumedEntries: [
      {
        orderEntryNumber: 1
      }
    ]
  }
];

@Pipe({
  name: 'cxTranslateUrl'
})
class MockTranslateUrlPipe implements PipeTransform {
  transform() {}
}

describe('CartItemListComponent', () => {
  let component: CartItemListComponent;
  let fixture: ComponentFixture<CartItemListComponent>;
  let cartService: CartService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ComponentsModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [
        CartItemListComponent,
        CartItemComponent,
        MockTranslateUrlPipe
      ],
      providers: [{ provide: CartService, useClass: MockCartService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartItemListComponent);
    cartService = TestBed.get(CartService);
    component = fixture.componentInstance;
    component.items = mockItems;
    component.potentialProductPromotions = mockPotentialProductPromotions;
    spyOn(cartService, 'removeEntry').and.callThrough();
    spyOn(cartService, 'updateEntry').and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove entry', () => {
    const item = mockItems[0];
    expect(component.form.controls[item.product.code]).toBeDefined();
    component.removeEntry(item);
    expect(cartService.removeEntry).toHaveBeenCalledWith(item);
    expect(component.form.controls[item.product.code]).toBeUndefined();
  });

  it('should update entry', () => {
    const item = mockItems[0];
    component.updateEntry({ item, updatedQuantity: 5 });
    expect(cartService.updateEntry).toHaveBeenCalledWith(item.entryNumber, 5);
  });

  it('should get potential promotions for product', () => {
    const item = mockItems[0];
    const promotions = component.getPotentialProductPromotionsForItem(item);
    expect(promotions).toEqual(mockPotentialProductPromotions);
  });
});
